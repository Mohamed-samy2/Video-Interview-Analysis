import cv2
import mediapipe as mp
import numpy as np
from mtcnn import MTCNN
import asyncio

class CheatingDetection:
    def __init__(self):
        pass

    async def detect_gaze_cheating_async(input_video_path):
        detector = MTCNN()
        mp_face_mesh = mp.solutions.face_mesh
        face_mesh = mp_face_mesh.FaceMesh(refine_landmarks=True, static_image_mode=False, max_num_faces=1)

        cap = cv2.VideoCapture(input_video_path)
        if not cap.isOpened():
            print("Could not open input video.")
            return

        fps = int(cap.get(cv2.CAP_PROP_FPS)) or 30
        frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

        LEFT_EYE_LANDMARKS = [33, 133]
        RIGHT_EYE_LANDMARKS = [362, 263]

        non_center_time = 0
        center_counter = 0
        cheating_detected = False
        CENTER_CONFIRMATION_TIME = 0.5  # seconds

        def is_gaze_centered(iris_x, eye_left, eye_right):
            eye_width = eye_right - eye_left
            rel_pos = (iris_x - eye_left) / eye_width
            return 0.44 < rel_pos < 0.56

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            faces = detector.detect_faces(frame)
            gaze = "UNKNOWN"

            if len(faces) == 0:
                gaze = "NO FACE"
                center_counter = 0
                non_center_time += 1 / fps
                if non_center_time >= 3:
                    cheating_detected = True
            else:
                face = faces[0]
                x, y, w, h = face['box']
                x, y = max(0, x), max(0, y)
                x2, y2 = min(frame_width, x + w), min(frame_height, y + h)
                face_roi = frame[y:y2, x:x2]

                rgb_face_roi = cv2.cvtColor(face_roi, cv2.COLOR_BGR2RGB)
                results = face_mesh.process(rgb_face_roi)

                if results.multi_face_landmarks:
                    for face_landmarks in results.multi_face_landmarks:
                        def to_px(pt):
                            return int(pt.x * w) + x, int(pt.y * h) + y

                        l_iris = to_px(face_landmarks.landmark[468])
                        r_iris = to_px(face_landmarks.landmark[473])
                        l_eye_left = to_px(face_landmarks.landmark[33])[0]
                        l_eye_right = to_px(face_landmarks.landmark[133])[0]
                        r_eye_left = to_px(face_landmarks.landmark[362])[0]
                        r_eye_right = to_px(face_landmarks.landmark[263])[0]

                        left_centered = is_gaze_centered(l_iris[0], l_eye_left, l_eye_right)
                        right_centered = is_gaze_centered(r_iris[0], r_eye_left, r_eye_right)

                        if left_centered and right_centered:
                            gaze = "CENTER"
                            center_counter += 1 / fps
                            if center_counter >= CENTER_CONFIRMATION_TIME:
                                non_center_time = 0
                        else:
                            gaze = "NOT CENTER"
                            center_counter = 0
                            non_center_time += 1 / fps
                            if non_center_time >= 3:
                                cheating_detected = True
                else:
                    gaze = "NO LANDMARKS"
                    center_counter = 0
                    non_center_time += 1 / fps
                    if non_center_time >= 3:
                        cheating_detected = True

            # print(f"Gaze: {gaze}, Non-Center Time: {non_center_time:.2f}s")

            # Simulate async wait (to yield control in event loop)
            await asyncio.sleep(0)

        cap.release()
        cv2.destroyAllWindows()

        print("\nFinished video.")
        if cheating_detected:
            print("⚠️ Cheating Detected: Prolonged non-centered gaze.")
            return 1
        else:
            print("✅ No cheating detected.")
            return 0

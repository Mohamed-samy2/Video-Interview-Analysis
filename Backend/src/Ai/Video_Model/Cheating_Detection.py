import cv2
import mediapipe as mp
import numpy as np
import asyncio

class CheatingDetection:
    def __init__(self):
        pass

    async def detect_gaze_cheating_async(video_path):
        mp_face_mesh = mp.solutions.face_mesh
        face_mesh = mp_face_mesh.FaceMesh(refine_landmarks=True, static_image_mode=False, max_num_faces=1)

        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            print("Could not open input video.")
            return -1

        fps = int(cap.get(cv2.CAP_PROP_FPS)) or 30
        frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

        LEFT_EYE_LANDMARKS = [33, 133]
        RIGHT_EYE_LANDMARKS = [362, 263]
        LEFT_IRIS_INDEX = 468
        RIGHT_IRIS_INDEX = 473

        non_center_time = 0
        center_counter = 0
        cheating_detected = False
        CENTER_CONFIRMATION_TIME = 0.5  # seconds

        def is_gaze_centered(iris_x, eye_left, eye_right):
            eye_width = eye_right - eye_left
            if eye_width == 0:  # avoid division by zero
                return False
            rel_pos = (iris_x - eye_left) / eye_width
            return 0.35 < rel_pos < 0.65

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = face_mesh.process(rgb_frame)

            if results.multi_face_landmarks:
                for face_landmarks in results.multi_face_landmarks:
                    l_iris_x = int(face_landmarks.landmark[LEFT_IRIS_INDEX].x * frame_width)
                    r_iris_x = int(face_landmarks.landmark[RIGHT_IRIS_INDEX].x * frame_width)
                    l_eye_left = int(face_landmarks.landmark[LEFT_EYE_LANDMARKS[0]].x * frame_width)
                    l_eye_right = int(face_landmarks.landmark[LEFT_EYE_LANDMARKS[1]].x * frame_width)
                    r_eye_left = int(face_landmarks.landmark[RIGHT_EYE_LANDMARKS[0]].x * frame_width)
                    r_eye_right = int(face_landmarks.landmark[RIGHT_EYE_LANDMARKS[1]].x * frame_width)

                    left_centered = is_gaze_centered(l_iris_x, l_eye_left, l_eye_right)
                    right_centered = is_gaze_centered(r_iris_x, r_eye_left, r_eye_right)

                    if left_centered and right_centered:
                        center_counter += 1 / fps
                        if center_counter >= CENTER_CONFIRMATION_TIME:
                            non_center_time = 0
                    else:
                        center_counter = 0
                        non_center_time += 1 / fps
                        if non_center_time >= 3:
                            cheating_detected = True
                            break
            else:
                center_counter = 0
                non_center_time += 1 / fps
                if non_center_time >= 3:
                    cheating_detected = True
                    break

            # Yield control to the event loop occasionally (good for long videos)
            await asyncio.sleep(0)

        cap.release()
        face_mesh.close()

        print(f"Candidated Cheating is {cheating_detected}")

        return 0 if cheating_detected else 1

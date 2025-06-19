import React from 'react';
import Footer from '../components/Footer';
import '../styles/AboutUsStyle.css'; // link to the CSS file

const teamMembers = [
  { name: 'Nadine Haitham', role: 'AI Developer', img: '/team/ahmed.jpg' },
  { name: 'Yomna Mohamed', role: 'Frontend Developer', img: '/team/yomna.jpg' },
  { name: 'Mohamed Samy', role: 'Backend Developer', img: '/team/samy.jpg' },
  { name: 'Mohamed Ashraf', role: 'UX Designer', img: '/team/sarah.jpg' },
  { name: 'Ammar Mohamed', role: 'UX Designer', img: '/team/sarah.jpg' },
  { name: 'Youssef Tamer', role: 'UX Designer', img: '/team/sarah.jpg' }
];

const About = () => {
  return (
    <>
      <div className="about-container">
        <section className="about-hero">
          <h1>About Prvia</h1>
          <p>
            PRVIA is an Egyptian platform that empowers companies to create and manage job offers
            with integrated video interview capabilities. Candidates can explore available jobs,
            apply, and—if shortlisted—receive an email with instructions and a video interview link.
          </p>
          <p>
            For recruiters, we provide a cutting-edge AI tool that analyzes submitted video
            interviews. Admins can easily send interview links, review candidate videos, and access
            AI-generated feedback—streamlining the entire interview process.
          </p>
          <p>
            Your privacy is our priority. All data is secure and shared only with the recruiters of
            the company you applied to.
          </p>
        </section>

        <section className="team-section">
          <h2>Our Team</h2>
          <div className="team-grid">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="team-card">
                <img src={member.img} alt={member.name} className="team-img" />
                <h5>{member.name}</h5>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default About;

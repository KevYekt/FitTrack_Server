import React from 'react';
import { useNavigate } from 'react-router-dom';
import './home.scss';
import Runner from '../../assets/runner.jpg';
import Food from '../../assets/food.jpg';
import Progress from '../../assets/mountainman.jpg';


const Home = () => {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate('/register'); // Assuming your register page route is '/register'
  };

  return (
    <div className="home">
      <section className="hero">
        <h1>Track Your Fitness Journey with Ease</h1>
        <p>Fittrack helps you monitor your progress, set goals, and stay motivated on your fitness journey.</p>
        <button onClick={handleGetStartedClick}>Get Started</button>
      </section>
      <section className="features">
        <h2>Our Key Features</h2>
        <div className="feature-list">
          <div className="feature">
            <img src={Runner} alt="Personalized Workout Plans" />
            <h3>Personalized Workout Plans</h3>
            <p>Create custom workout plans tailored to your goals and preferences.</p>
          </div>
          <div className="feature">
            <img src={Food} alt="Nutrition Tracking" />
            <h3>Nutrition Tracking</h3>
            <p>Log your daily food intake and monitor your nutritional goals.</p>
          </div>
          <div className="feature">
            <img src={Progress} alt="Progress Tracking" />
            <h3>Progress Tracking</h3>
            <p>Visualize your progress with detailed charts and insights on your performance.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
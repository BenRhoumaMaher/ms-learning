import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRecommendedCourses, getCourses, getForumPosts } from '../../../../helpers/api';

const UserProfileSidebar = () => {
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [adCourses, setAdCourses] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [forums, setForums] = useState([]);

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const token =
          localStorage.getItem('token') || sessionStorage.getItem('token');

        if (!token) {
          console.warn('No auth token found');
          return;
        }

        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload?.user_id;

        if (userId) {
          const recCourses = await getRecommendedCourses(userId);
          const shuffled = recCourses.sort(() => 0.5 - Math.random());
          setRecommendedCourses(shuffled.slice(0, 3));
        }

        const allCourses = await getCourses();
        setAdCourses(allCourses);

        const forumPosts = await getForumPosts();
        const shuffledForums = forumPosts.sort(() => 0.5 - Math.random());
        setForums(shuffledForums.slice(0, 4));
      } catch (err) {
        console.error('Error loading sidebar data:', err);
      }
    };

    fetchSidebarData();
  }, []);

  useEffect(() => {
    if (adCourses.length === 0) return;

    const interval = setInterval(() => {
      setCurrentAdIndex(prev => (prev + 1) % adCourses.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [adCourses]);

  return (
    <div className="main--sidebar pb--60" data-trigger="stickyScroll">
      <div className="widget">
        <h2 className="h4 fw--700 widget--title">Notice</h2>
        <div className="text--widget">
          <p>There are many variations of passages of Lorem Ipsum...</p>
        </div>
      </div>

      <div className="widget">
        <h2 className="h4 fw--700 widget--title">Forums</h2>
        <div className="links--widget">
          <ul className="nav" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', listStyle: 'none', padding: 0 }}>
            {forums.length > 0 ? forums.map((forum) => (
              <>
                <Link
                  to={`/forum-post/${forum.id}`}
                  style={{
                    gridColumn: '1',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                  }}
                >
                  {forum.title}
                </Link>
                <span style={{ gridColumn: '2' }}>({forum.views})</span>
              </>
            )) : <li style={{ gridColumn: '1 / -1' }}>Loading forums...</li>}
          </ul>
        </div>
      </div>

      <div className="widget">
        <h2 className="h4 fw--700 widget--title">Recommended Courses</h2>
        <div className="nav--widget">
          <ul className="nav">
            {recommendedCourses.length > 0 ? recommendedCourses.map(course => (
              <li key={course.id}>
                <Link to={`/registered-courses/${course.id}`}>
                  <i className="fa fa-book"></i>
                  <span className="text">{course.title}</span>
                </Link>
              </li>
            )) : <li>Loading courses...</li>}
          </ul>
        </div>
      </div>

      <div className="widget">
        <h2 className="h4 fw--700 widget--title">Advertisements</h2>
        <div className="ad--widget">
          {adCourses.length > 0 ? (
            <Link to={`/registered-courses/${adCourses[currentAdIndex].id}`}>
              <img
                src={`http://localhost:8080/${adCourses[currentAdIndex].image}`}
                alt={adCourses[currentAdIndex].title}
                className="center-block"
              />
            </Link>
          ) : (
            <p>Loading advertisement...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileSidebar;

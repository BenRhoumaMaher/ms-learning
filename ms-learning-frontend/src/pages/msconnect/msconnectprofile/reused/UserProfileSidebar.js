import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRecommendedCourses, getCourses, getForumPosts, getUserInfos } from '../../../../helpers/api';
import { useTranslation } from 'react-i18next';

const UserProfileSidebar = () => {
  const { t } = useTranslation();
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [adCourses, setAdCourses] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [forums, setForums] = useState([]);
  const [isInstructor, setIsInstructor] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');

        if (!token) {
          console.warn('No auth token found');
          setLoading(false);
          return;
        }

        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload?.user_id;

        if (userId) {
          const userInfo = await getUserInfos(userId);
          const roles = userInfo.role || [];
          setIsInstructor(roles.includes('ROLE_INSTRUCTOR'));

          if (!roles.includes('ROLE_INSTRUCTOR')) {
            const recCourses = await getRecommendedCourses(userId);
            const shuffled = recCourses.sort(() => 0.5 - Math.random());
            setRecommendedCourses(shuffled.slice(0, 3));
          }
        }

        const [allCourses, forumPosts] = await Promise.all([
          getCourses(),
          getForumPosts()
        ]);

        setAdCourses(allCourses);
        const shuffledForums = forumPosts.sort(() => 0.5 - Math.random());
        setForums(shuffledForums.slice(0, 4));
      } catch (err) {
        console.error('Error loading sidebar data:', err);
      } finally {
        setLoading(false);
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

  if (loading) {
    return (
      <div className="main--sidebar pb--60">
        <p>Loading sidebar...</p>
      </div>
    );
  }

  return (
    <div className="main--sidebar pb--60" data-trigger="stickyScroll">
      <div className="widget">
        <h2 className="h4 fw--700 widget--title">{t("Forums")}</h2>
        <div className="links--widget">
          <ul className="nav" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', listStyle: 'none', padding: 0 }}>
            {forums.length > 0 ? forums.map((forum) => (
              <React.Fragment key={forum.id}>
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
              </React.Fragment>
            )) : <li style={{ gridColumn: '1 / -1' }}>{t("No forums available")}</li>}
          </ul>
        </div>
      </div>

      {!isInstructor && (
        <div className="widget">
          <h2 className="h4 fw--700 widget--title">{t("Recommended Courses")}</h2>
          <div className="nav--widget">
            <ul className="nav">
              {recommendedCourses.length > 0 ? recommendedCourses.map(course => (
                <li key={course.id}>
                  <Link to={`/registered-courses/${course.id}`}>
                    <i className="fa fa-book"></i>
                    <span className="text">{course.title}</span>
                  </Link>
                </li>
              )) : <li>{t("No recommended courses")}</li>}
            </ul>
          </div>
        </div>
      )}

      <div className="widget">
        <h2 className="h4 fw--700 widget--title">{t("Advertisements")}</h2>
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
            <p>{t("No advertisements available")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileSidebar;
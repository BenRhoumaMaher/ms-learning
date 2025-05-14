import React, { useEffect, useState } from 'react';
import { getForumPosts } from '../../../../../helpers/api';
import { useTranslation } from 'react-i18next';

const RecentBlogsWidget = () => {
    const [randomPosts, setRandomPosts] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const posts = await getForumPosts();
                const validPosts = posts.filter(p => p.image && p.title);
                const shuffled = validPosts.sort(() => 0.5 - Math.random());
                setRandomPosts(shuffled.slice(0, 2));
            } catch (error) {
                console.error('Error fetching forum posts:', error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="widget">
            <h4 className="widget-title">
                {t("Recommended Reading")} <a className="see-all" href="/" title="">{t("See All")}</a>
            </h4>
            <ul className="recent-links">
                {randomPosts.map((blog, index) => (
                    <li key={index}>
                        <figure>
                            <img
                                src={`http://localhost:8080/${blog.image}`}
                                alt="Forum preview"
                                style={{ objectFit: 'cover', maxHeight: '80px' }}
                            />
                        </figure>
                        <div className="re-links-meta">
                            <h6>
                                <a href="/" title={blog.title}>
                                    {blog.title.length > 30 ? blog.title.substring(0, 30) + '...' : blog.title}
                                </a>
                            </h6>
                            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecentBlogsWidget;

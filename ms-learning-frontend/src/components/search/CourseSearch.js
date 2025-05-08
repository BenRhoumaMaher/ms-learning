import React, { useState, useEffect, useCallback } from 'react';
import { searchCourses } from '../../helpers/api';
import { Input, Spin } from 'antd';
import { Link } from 'react-router-dom';

const { Search } = Input;

const CourseSearch = ({ compact = false }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const fetchResults = useCallback(async () => {
        if (query.length < 2) {
            setResults([]);
            return;
        }
        setLoading(true);
        try {
            const data = await searchCourses(query);
            setResults(data || []);
        } catch (error) {
            console.error(error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, [query]);

    useEffect(() => {
        if (query.length > 1) {
            const timer = setTimeout(() => {
                fetchResults();
            }, 300);
            return () => clearTimeout(timer);
        } else {
            setResults([]);
        }
    }, [query, fetchResults]);

    return (
        <div className={`course-search ${compact ? 'compact' : ''}`}>
            <Search
                placeholder="Search courses..."
                enterButton={!compact}
                size={compact ? 'middle' : 'large'}
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                loading={loading}
            />

            {showResults && query && (
                <div className="search-results-dropdown">
                    <div className="search-results-container">
                        {loading && <Spin style={{ margin: '10px 0' }} />}

                        {!loading && results.length > 0 && (
                            <ul className="search-results-list">
                                {results.map(course => (
                                    <li key={course.id} className="search-result-item">
                                        <Link
                                            to={`/course/${course.id}`}
                                            className="search-result-link"
                                            onClick={() => setShowResults(false)}
                                        >
                                            {course.image && (
                                                <img
                                                    alt={course.title}
                                                    src={`http://localhost:8080/${course.image}`}
                                                    className="search-result-image"
                                                />
                                            )}
                                            <div className="search-result-info">
                                                <h5>{course.title}</h5>
                                                <p>{course.description?.substring(0, 60)}...</p>
                                                {course.price !== undefined && course.price !== null && (
                                                    <div className="search-result-price">
                                                        ${typeof course.price === 'number'
                                                            ? course.price.toFixed(2)
                                                            : parseFloat(course.price).toFixed(2)}
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {!loading && query.length > 1 && results.length === 0 && (
                            <div className="no-results">No courses found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseSearch;
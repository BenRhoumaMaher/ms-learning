import { useState, useEffect } from 'react';
import { getCategories } from '../helpers/api';

const useCategories = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error('Failed to load categories', error);
            }
        };

        fetchCategories();
    }, []);

    return categories;
};

export default useCategories;

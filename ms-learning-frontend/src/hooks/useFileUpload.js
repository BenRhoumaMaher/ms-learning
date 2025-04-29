import { useRef, useState } from 'react';

const useFileUpload = () => {
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const handlePhotoClick = (e) => {
        e.preventDefault();
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    return {
        fileInputRef,
        selectedFile,
        handlePhotoClick,
        handleFileChange,
        setSelectedFile
    };
};

export default useFileUpload;

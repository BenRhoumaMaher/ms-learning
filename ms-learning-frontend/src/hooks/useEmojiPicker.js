import { useState } from 'react';

const useEmojiPicker = (setContent) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const toggleEmojiPicker = (e) => {
        e.preventDefault();
        setShowEmojiPicker((prev) => !prev);
    };

    const handleEmojiClick = (emojiData) => {
        setContent((prev) => prev + emojiData.emoji);
        setShowEmojiPicker(false);
    };

    return {
        showEmojiPicker,
        toggleEmojiPicker,
        handleEmojiClick
    };
};

export default useEmojiPicker;

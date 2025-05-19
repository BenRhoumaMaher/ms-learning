import React, { useState } from 'react';

const FlashcardComponent = ({ card }) => {
    const [flipped, setFlipped] = useState(false);

    return (
        <div
            className="flashcard mb-2"
            onClick={() => setFlipped(!flipped)}
            style={{
                border: '1px solid #ddd',
                borderRadius: '5px',
                padding: '10px',
                cursor: 'pointer',
                backgroundColor: flipped ? '#f8f9fa' : 'white',
                transition: 'transform 0.6s',
                transformStyle: 'preserve-3d',
                position: 'relative',
                minHeight: '80px'
            }}
        >
            <div className="text-end mb-1">
                <small className="text-muted">{flipped ? 'Click to see question' : 'Click to see answer'}</small>
            </div>
            {flipped ? (
                <div className="card-back">
                    <p style={{ fontSize: '0.8rem' }}>{card.back}</p>
                </div>
            ) : (
                <div className="card-front">
                    <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{card.front}</p>
                </div>
            )}
        </div>
    );
};

export default FlashcardComponent;
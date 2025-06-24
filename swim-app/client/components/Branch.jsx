import React from 'react';
import { fetchData } from '../js-files/GeneralRequests';

function Branch({ branch, isSelected, onSelect }) {
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;

        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        return `http://localhost:3000/${imagePath}`;
    };

    const imageUrl = getImageUrl(branch.image_path);

    const handleError = (errorType, error) => {
        console.error(`${errorType}:`, error);
    };


    return (
        <div
            className={`branch-card ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelect(branch.pool_id)}
        >
            <div className="branch-image">
                {imageUrl ? (
                    <>
                        <img
                            src={imageUrl}
                            alt={branch.name}
                            className="branch-img"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                        <div
                            className="image-placeholder"
                            style={{ display: 'none' }}
                        >
                            🏊‍♂️ {branch.name}
                        </div>
                    </>
                ) : (
                    <div className="image-placeholder">
                        🏊‍♂️ {branch.name}
                        <br />
                        <small style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                            (אין תמונה)
                        </small>
                    </div>
                )}
            </div>

            <div className="branch-content">
                <h2 className="branch-name">{branch.name}</h2>

                <div className="branch-info">
                    <div className="info-item">
                        <span className="info-icon">📍</span>
                        <span className="info-text">{branch.city}</span>
                    </div>

                    {branch.phone && (
                        <div className="info-item">
                            <span className="info-icon">📞</span>
                            <span className="info-text">{branch.phone}</span>
                        </div>
                    )}

                    {branch.description && (
                        <div className="info-item">
                            <span className="info-icon">ℹ️</span>
                            <span className="info-text">{branch.description}</span>
                        </div>
                    )}
                </div>

                {isSelected && (
                    <div className="branch-details">
                        <div className="branch-actions">
                            {branch.latitude && branch.longitude && (
                                <button
                                    className="btn-secondary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(`https://www.google.com/maps/dir/?api=1&destination=${branch.latitude},${branch.longitude}`, '_blank');
                                    }}
                                >
                                    הוראות הגעה
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Branch;

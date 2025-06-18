// src/components/AuthModal.tsx
import React from 'react';
import { Auth } from './Auth';
import './Auth.css';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, className = '' }) => {
    if (!isOpen) return null;

    return (
        <div className={`modal-overlay ${className}`}>
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    ×
                </button>
                <Auth />
            </div>
        </div>
    );
};

export default AuthModal;
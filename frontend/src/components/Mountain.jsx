
import React, { useState } from 'react';
import './mountain.css';
import mountainService from '../services/mountainService';
import AuthService from '../services/authenticationService';

const Mountain = ({ selectedMountain, setSelectedItem }) => {
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        id: selectedMountain ? selectedMountain.id : null,
        name: selectedMountain ? selectedMountain.name : '',
        elevation: selectedMountain ? selectedMountain.elevation : '',
        longitude: selectedMountain ? selectedMountain.geometry.coordinates[0] : '',
        latitude: selectedMountain ? selectedMountain.geometry.coordinates[1] : '',
        hasmountainrailway: selectedMountain ? selectedMountain.mountainrailway : false,
        image: null,
        description: selectedMountain && selectedMountain.description ? selectedMountain.description : ''
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'file') {
            setFormData(prev => ({
                ...prev,
                [name]: files[0]
            }));
        } else if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: checked
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Sind Sie sicher, dass Sie diesen Berg löschen möchten?')) {
            try {
                const success = await mountainService.deleteMountain(formData.id);
                if (success) {
                    await AuthService.updateToken(() => {
                    setSelectedItem('menuIdHome');
                });
                }
            } catch (error) {
                console.error('Error deleting mountain:', error);
                alert('Fehler beim Löschen des Berges');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const mountainData = {
                id: formData.id,
                name: formData.name,
                elevation: parseFloat(formData.elevation),
                longitude: parseFloat(formData.longitude),
                latitude: parseFloat(formData.latitude),
                hasmountainrailway: formData.hasmountainrailway,
                description: formData.description
            };

            let mountain;
            if (formData.id) {
                mountain = await mountainService.updateMountain(mountainData);
            } else {
                mountain = await mountainService.createMountain(mountainData);
            }

            // If there's an image, upload it
            if (formData.image) {
                await mountainService.uploadMountainImage(mountain.id, formData.image);
            }

            // Reset form
            setFormData({
                id: null,
                name: '',
                elevation: '',
                longitude: '',
                latitude: '',
                hasmountainrailway: false,
                image: null,
                description: ''
            });

            await AuthService.updateToken(() => {
                setSelectedItem('menuIdHome');
            });
        } catch (error) {
            console.error('Error saving mountain:', error);
            let errorMessage = 'Fehler beim Speichern des Berges';
            if (error.response?.status === 422 && error.response?.data?.errors) {
                errorMessage = error.response.data.errors.map(err => err.msg).join('\n');
            } else if (error.response?.data?.error?.msg) {
                errorMessage = error.response.data.error.msg;
            } else if (error.message) {
                errorMessage = error.message;
            }
            setError(errorMessage);
        }
    };

    return (
        <form className="mountain-form" onSubmit={handleSubmit}>
            {formData.id && (
                <button
                    type="button"
                    onClick={handleDelete}
                    className="delete-button"
                    style={{
                        backgroundColor: '#ff4444',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginBottom: '20px'
                    }}
                >
                    Berg löschen
                </button>
            )}
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name des Berges"
                required
            />
            <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Beschreibung (optional, kann Link enthalten)"
            />
            <input
                type="number"
                name="elevation"
                value={formData.elevation}
                onChange={handleInputChange}
                placeholder="Meter über Meer"
                required
            />
            <input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                placeholder="Längengrad"
                step="any"
                required
            />
            <input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                placeholder="Breitengrad"
                step="any"
                required
            />
            <div className="checkbox-container">
                <input
                    type="checkbox"
                    name="hasmountainrailway"
                    checked={formData.hasmountainrailway}
                    onChange={handleInputChange}
                />
                <label>Hat Bergbahn</label>
            </div>
            <input
                type="file"
                name="image"
                onChange={handleInputChange}
                accept="image/*"
            />
            {error && (
                <div style={{
                    backgroundColor: '#ffebee',
                    border: '1px solid #ef5350',
                    borderRadius: '4px',
                    padding: '12px',
                    marginBottom: '15px',
                    color: '#c62828',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <span style={{ marginRight: '8px' }}>⚠️</span>
                    {error}
                </div>
            )}
            <button type="submit">
                {formData.id ? 'Berg aktualisieren' : 'Berg hinzufügen'}
            </button>
        
        {selectedMountain && selectedMountain.description && (
            <div style={{ marginTop: '20px', wordBreak: 'break-word' }}>
                <strong>Beschreibung:</strong>{' '}
                {(() => {
                    const urlRegex = /(https?:\/\/[^\s]+)/g;
                    const parts = selectedMountain.description.split(urlRegex);
                    return parts.map((part, idx) =>
                        urlRegex.test(part) ? (
                            <a key={idx} href={part} target="_blank" rel="noopener noreferrer">{part}</a>
                        ) : (
                            <span key={idx}>{part}</span>
                        )
                    );
                })()}
            </div>
        )}
        </form>
    );
};

export default Mountain;
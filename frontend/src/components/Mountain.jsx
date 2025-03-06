
import React, { useState } from 'react';
import './mountain.css';
import mountainService from '../services/mountainService';

const Mountain = ({ selectedMountain }) => {
    const [formData, setFormData] = useState({
        id: selectedMountain ? selectedMountain.id : null,
        name: selectedMountain ? selectedMountain.name : '',
        elevation: selectedMountain ? selectedMountain.elevation : '',
        longitude: selectedMountain ? selectedMountain.geometry.coordinates[0] : '',
        latitude: selectedMountain ? selectedMountain.geometry.coordinates[1] : '',
        hasmountainrailway: selectedMountain ? selectedMountain.mountainrailway : false,
        image: null
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const mountainData = {
                id: formData.id,
                name: formData.name,
                elevation: parseFloat(formData.elevation),
                longitude: parseFloat(formData.longitude),
                latitude: parseFloat(formData.latitude),
                hasmountainrailway: formData.hasmountainrailway
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
                image: null
            });

            window.location.href = '/home';
        } catch (error) {
            console.error('Error saving mountain:', error);
            alert('Fehler beim Speichern des Berges');
        }
    };

    return (
        <form className="mountain-form" onSubmit={handleSubmit}>
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name des Berges"
                required
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
            <button type="submit">
                {formData.id ? 'Berg aktualisieren' : 'Berg hinzufügen'}
            </button>
        </form>
    );
};

export default Mountain;
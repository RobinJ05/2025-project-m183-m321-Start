
import React, { useState } from 'react';
import './mountain.css';
import mountainService from '../services/mountainService';

const Mountain = () => {
    const [formData, setFormData] = useState({
        name: '',
        elevation: '',
        longitude: '',
        latitude: '',
        hasmountainrailway: false,
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
            // First create the mountain
            const mountainData = {
                name: formData.name,
                elevation: parseFloat(formData.elevation),
                longitude: parseFloat(formData.longitude),
                latitude: parseFloat(formData.latitude),
                hasmountainrailway: formData.hasmountainrailway
            };

            const mountain = await mountainService.createMountain(mountainData);

            console.log("Mountain: " + JSON.stringify(mountain));

            // If there's an image, upload it
            if (formData.image) {
                await mountainService.uploadMountainImage(mountain.id, formData.image);
            }

            // Reset form
            setFormData({
                name: '',
                elevation: '',
                longitude: '',
                latitude: '',
                hasmountainrailway: false,
                image: null
            });

            window.location.href = '/home';
        } catch (error) {
            console.error('Error creating mountain:', error);
            alert('Fehler beim Hinzufügen des Berges');
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
            <div>
                <label>
                    <input
                        type="checkbox"
                        name="hasmountainrailway"
                        checked={formData.hasmountainrailway}
                        onChange={handleInputChange}
                    />
                    Hat eine Bergbahn
                </label>
            </div>
            <input
                type="file"
                name="image"
                onChange={handleInputChange}
                accept="image/*"
            />
            <button type="submit">Berg hinzufügen</button>
        </form>
    );
};

export default Mountain;
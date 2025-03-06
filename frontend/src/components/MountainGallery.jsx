import './mountainGallery.css'
import AuthService from '../services/authenticationService';

const MountainGallery = ({ mountains, onMountainSelect }) => {
    const handleMountainClick = (mountain) => {
        if (!AuthService.isLoggedIn()) {
            alert('Sie müssen eingeloggt sein, um einen Berg zu bearbeiten.');
            return;
        }
        onMountainSelect(mountain);
    };

    return (
        <div className="mountain-grid">
            {mountains.map((mountain) => (
                <div key={mountain.id} className="mountain-card" onClick={() => handleMountainClick(mountain)}>
                    <h2 className="mountain-title">{mountain.name}</h2>
                    <img
                        src={mountain.img}
                        alt={mountain.name}
                        className="mountain-image"
                    />
                    <p className="mountain-elevation">{mountain.elevation} m.ü.M</p>
                    <div className="mountain-coordinates">
                        <span>Lon: {mountain.geometry.coordinates[0]}°</span>
                        <span>Lat: {mountain.geometry.coordinates[1]}°</span>
                    </div>
                    <p className="mountain-railway">
                        {mountain.mountainrailway ? '🚠 Mountain Railway Available' : '❌ No Mountain Railway'}
                    </p>
                </div>
            ))}
        </div>);
}

export default MountainGallery;
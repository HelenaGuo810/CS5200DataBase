import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box,
  TextField,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import './Resources.css';

// Import all portfolio images
import seraphImage from '../../assets/portfolio/desktop/image-seraph.jpg';
import eeboxImage from '../../assets/portfolio/desktop/image-eebox.jpg';
import federalImage from '../../assets/portfolio/desktop/image-federal.jpg';
import delSolImage from '../../assets/portfolio/desktop/image-del-sol.jpg';
import prototypeImage from '../../assets/portfolio/desktop/image-prototype.jpg';
import tower228bImage from '../../assets/portfolio/desktop/image-228b.jpg';
import edelweissImage from '../../assets/portfolio/desktop/image-edelweiss.jpg';
import netcryImage from '../../assets/portfolio/desktop/image-netcry.jpg';
import hypersImage from '../../assets/portfolio/desktop/image-hypers.jpg';
import sxivImage from '../../assets/portfolio/desktop/image-sxiv.jpg';
import trinityImage from '../../assets/portfolio/desktop/image-trinity.jpg';
import paramourImage from '../../assets/portfolio/desktop/image-paramour.jpg';

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [portfolioData, setPortfolioData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch portfolio data from API
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        console.log('Fetching portfolio data from API...');
        
        // Set a timeout to ensure we don't wait too long for the API
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('API request timed out')), 5000)
        );
        
        const fetchPromise = fetch('http://localhost:8000/api/portfolio');
        
        // Race between fetch and timeout
        const response = await Promise.race([fetchPromise, timeoutPromise]);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch portfolio data: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Portfolio data fetched successfully:', data);
        
        if (!data || data.length === 0) {
          throw new Error('API returned empty portfolio data');
        }
        
        setPortfolioData(data);
        setLoading(false);
        setError(null);
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
        setError(`Failed to load resources: ${error.message}. Please try refreshing or check server connection.`);
        setLoading(false);
      }
    };
    
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/portfolio/categories');
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        // Filter out any potential 'all' that might be coming from the server
        const filteredData = data.filter(cat => cat.toLowerCase() !== 'all');
        // Add only a single 'all' category at the beginning
        setCategories(['all', ...filteredData]);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback categories if API fails
        setCategories(['all', 'Commercial', 'Residential', 'Cultural', 'Educational']);
      }
    };
    
    // Fetch data from API
    fetchPortfolioData();
    fetchCategories();
  }, []); // Only run once on mount

  const filteredProjects = portfolioData.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Helper function to determine the correct image source
  const getImageSrc = (image) => {
    // Use local imports as fallbacks
    const imageNameMap = {
      'image-seraph.jpg': seraphImage,
      'image-eebox.jpg': eeboxImage,
      'image-federal.jpg': federalImage,
      'image-del-sol.jpg': delSolImage,
      'image-prototype.jpg': prototypeImage,
      'image-228b.jpg': tower228bImage,
      'image-edelweiss.jpg': edelweissImage,
      'image-netcry.jpg': netcryImage,
      'image-hypers.jpg': hypersImage,
      'image-sxiv.jpg': sxivImage,
      'image-trinity.jpg': trinityImage,
      'image-paramour.jpg': paramourImage
    };
    
    try {
      // If this is a full URL from API, use it directly
      if (typeof image === 'string' && (image.startsWith('http://') || image.startsWith('https://'))) {
        return image;
      }
      
      // Extract filename if it's a path
      if (typeof image === 'string') {
        const filename = image.split('/').pop();
        if (imageNameMap[filename]) {
          return imageNameMap[filename];
        }
        
        // Try to match by partial name
        for (const [key, value] of Object.entries(imageNameMap)) {
          if (image.includes(key.replace('image-', '').replace('.jpg', ''))) {
            return value;
          }
        }
      }
    } catch (error) {
      console.error("Error processing image path:", error);
    }
    
    // Final fallback
    console.warn(`No matching image found for: ${image}, using fallback`);
    return seraphImage;
  };

  return (
    <Container maxWidth="lg" className="resources-container">
      {/* Header Section */}
      <Box className="resources-header">
        <Typography variant="h3" component="h1" gutterBottom>
          Architecture Resources
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" component="p">
          Explore study cases of architectural projects and resources
        </Typography>
      </Box>

      {/* Search and Filter Section */}
      <Box className="search-filter-section">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slots={{
            startAdornment: SearchIcon
          }}
          slotProps={{
            startAdornment: {
              position: 'start'
            }
          }}
        />
        <Box className="category-chips">
          {categories.map((category) => (
            <Chip
              key={category}
              label={category.charAt(0).toUpperCase() + category.slice(1)}
              onClick={() => setSelectedCategory(category)}
              color={selectedCategory === category ? "primary" : "default"}
              variant={selectedCategory === category ? "filled" : "outlined"}
            />
          ))}
        </Box>
      </Box>

      {/* Loading and Error States */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box sx={{ textAlign: 'center', my: 4, color: 'error.main' }}>
          <Typography>{error}</Typography>
        </Box>
      )}

      {/* Projects Grid */}
      {!loading && !error && (
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <Card className="project-card" key={project.key}>
              <CardMedia
                component="img"
                height="240"
                image={getImageSrc(project.image)}
                alt={project.name}
                className="project-image"
                onError={(e) => {
                  console.error(`Failed to load image: ${project.image}`);
                  e.target.src = seraphImage;
                }}
              />
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  {project.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" component="p" sx={{ mb: 1 }}>
                  {project.date}
                </Typography>
                <Typography variant="body2" color="text.secondary" component="p">
                  {project.description}
                </Typography>
                <Box className="project-actions">
                  <Tooltip title="Save">
                    <IconButton size="small">
                      <FavoriteIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Share">
                    <IconButton size="small">
                      <ShareIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
} 
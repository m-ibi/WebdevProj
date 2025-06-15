import { useState } from 'react';
import { 
    InputBase, 
    IconButton, 
    Paper, 
    Box,
    Popover,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button
} from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface SearchParams {
    query: string;
    species: string;
    sort: string;
}

const SearchBar = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useState<SearchParams>({
        query: '',
        species: '',
        sort: 'newest'
    });
    
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    
    const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleFilterClose = () => {
        setAnchorEl(null);
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchParams({ ...searchParams, query: e.target.value });
    };
    
    const handleFilterChange = (e: any) => {
        const { name, value } = e.target;
        setSearchParams({ ...searchParams, [name]: value });
    };
    
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Build query string
        const params = new URLSearchParams();
        if (searchParams.query) params.append('query', searchParams.query);
        if (searchParams.species) params.append('species', searchParams.species);
        if (searchParams.sort) params.append('sort', searchParams.sort);
        
        navigate(`/?${params.toString()}`);
        handleFilterClose();
    };
    
    const open = Boolean(anchorEl);
    
    return (
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', maxWidth: 600, mx: 'auto' }}>
            <Paper
                component="form"
                onSubmit={handleSearch}
                sx={{
                    p: '2px 4px',
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%'
                }}
            >
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search pets..."
                    value={searchParams.query}
                    onChange={handleChange}
                />
                <IconButton 
                    sx={{ p: '10px' }} 
                    aria-label="filter"
                    onClick={handleFilterClick}
                >
                    <FilterIcon />
                </IconButton>
                <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                    <SearchIcon />
                </IconButton>
                
                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleFilterClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <Box sx={{ p: 2, width: 250 }}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Species</InputLabel>
                            <Select
                                name="species"
                                value={searchParams.species}
                                label="Species"
                                onChange={handleFilterChange}
                            >
                                <MenuItem value="">Any</MenuItem>
                                <MenuItem value="Dog">Dog</MenuItem>
                                <MenuItem value="Cat">Cat</MenuItem>
                                <MenuItem value="Bird">Bird</MenuItem>
                                <MenuItem value="Fish">Fish</MenuItem>
                                <MenuItem value="Reptile">Reptile</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </Select>
                        </FormControl>
                        
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Sort By</InputLabel>
                            <Select
                                name="sort"
                                value={searchParams.sort}
                                label="Sort By"
                                onChange={handleFilterChange}
                            >
                                <MenuItem value="newest">Newest First</MenuItem>
                                <MenuItem value="oldest">Oldest First</MenuItem>
                                <MenuItem value="popular">Most Popular</MenuItem>
                            </Select>
                        </FormControl>
                        
                        <Button 
                            variant="contained" 
                            fullWidth 
                            onClick={handleSearch}
                        >
                            Apply Filters
                        </Button>
                    </Box>
                </Popover>
            </Paper>
        </Box>
    );
};

export default SearchBar;
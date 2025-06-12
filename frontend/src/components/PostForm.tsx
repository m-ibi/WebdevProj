import { useState, ChangeEvent } from 'react';
import { 
    Box, 
    TextField, 
    Button, 
    Typography, 
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Card,
    CardMedia
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';

interface PostFormData {
    title: string;
    content: string;
    species: string;
    breed: string;
}

interface PostFormProps {
    initialData?: PostFormData;
    onSubmit: (formData: FormData) => Promise<void>;
    isSubmitting: boolean;
    error: string | null;
}

const PostForm = ({ initialData, onSubmit, isSubmitting, error }: PostFormProps) => {
    const [formData, setFormData] = useState<PostFormData>(
        initialData || {
            title: '',
            content: '',
            species: '',
            breed: ''
        }
    );
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSelectChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            setImages([...images, ...selectedFiles]);

            // Create URLs for previews
            const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
            setPreviews([...previews, ...newPreviews]);
        }
    };

    const handleRemoveImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
        
        // Revoke the object URL to avoid memory leaks
        URL.revokeObjectURL(previews[index]);
        setPreviews(previews.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('content', formData.content);
        formDataToSend.append('species', formData.species);
        formDataToSend.append('breed', formData.breed);
        
        images.forEach(image => {
            formDataToSend.append('images', image);
        });
        
        await onSubmit(formDataToSend);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            
            <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                margin="normal"
                required
            />
            
            <TextField
                fullWidth
                label="Content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={4}
                required
            />
            
            <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
                <FormControl fullWidth>
                    <InputLabel>Species</InputLabel>
                    <Select
                        name="species"
                        value={formData.species}
                        onChange={handleSelectChange}
                        required
                    >
                        <MenuItem value="Dog">Dog</MenuItem>
                        <MenuItem value="Cat">Cat</MenuItem>
                        <MenuItem value="Bird">Bird</MenuItem>
                        <MenuItem value="Fish">Fish</MenuItem>
                        <MenuItem value="Reptile">Reptile</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </Select>
                </FormControl>
                
                <TextField
                    fullWidth
                    label="Breed"
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
            </Box>
            
            <Button
                variant="contained"
                component="label"
                startIcon={<PhotoCamera />}
                sx={{ mt: 2 }}
            >
                Add Images
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                />
            </Button>
            
            {previews.length > 0 && (
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {previews.map((preview, index) => (
                        <Card key={index} sx={{ width: 100, position: 'relative' }}>
                            <CardMedia
                                component="img"
                                height="100"
                                image={preview}
                                alt={`Preview ${index}`}
                            />
                            <Button
                                size="small"
                                color="error"
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    minWidth: '30px',
                                    p: 0
                                }}
                                onClick={() => handleRemoveImage(index)}
                            >
                                X
                            </Button>
                        </Card>
                    ))}
                </Box>
            )}
            
            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
                disabled={isSubmitting}
            >
                {isSubmitting ? "Submitting..." : "Submit Post"}
            </Button>
        </Box>
    );
};

export default PostForm;
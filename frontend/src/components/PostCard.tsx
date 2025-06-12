import { Card, CardContent, CardMedia, Typography, CardActions, Button } from '@mui/material';
import { Post } from '../types';
import { Link } from 'react-router-dom';

interface PostCardProps {
    post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
                component="img"
                height="200"
                image={post.imageUrls[0] || '/placeholder.jpg'}
                alt={post.title}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                    {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {post.content.substring(0, 100)}...
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {post.species} - {post.breed}
                </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Button 
                    size="small" 
                    component={Link} 
                    to={`/post/${post._id}`}
                >
                    View Details
                </Button>
                <Typography variant="body2" color="text.secondary">
                    Likes: {post.likes.length}
                </Typography>
            </CardActions>
        </Card>
    );
};

export default PostCard;
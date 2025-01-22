import { Container, Grid, Card, CardContent, CardActions, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { BiddingTypeInfo } from '../types';

function Home() {
  const biddingTypes: BiddingTypeInfo[] = [
    { id: 'dispensa', name: 'Dispensa de Licitação' },
    { id: 'inexigibilidade', name: 'Inexigibilidade' },
    { id: 'pregao', name: 'Pregão' },
    { id: 'tomada-precos', name: 'Tomada de Preços' }
  ];

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Modalidades de Licitação
      </Typography>
      <Grid container spacing={3}>
        {biddingTypes.map((type) => (
          <Grid item xs={12} sm={6} md={3} key={type.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  {type.name}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  component={Link} 
                  to={`/bidding/${type.id}`}
                  size="small" 
                  color="primary"
                >
                  Acessar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Home;
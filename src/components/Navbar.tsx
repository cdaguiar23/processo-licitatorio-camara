import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'white' }}>
          Sistema de Licitações
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/suppliers">
            Cadastro de Fornecedores
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
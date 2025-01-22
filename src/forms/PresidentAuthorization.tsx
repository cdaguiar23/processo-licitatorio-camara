import { Box, Button, Grid, TextField, Typography, Select, MenuItem } from '@mui/material';

function PresidentAuthorization() {
  const currentYear = new Date().getFullYear();

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', p: 3 }}>
      <Typography variant="h6" align="center" gutterBottom>
        AUTORIZAÇÃO DO PRESIDENTE
      </Typography>
      <Typography variant="subtitle2" align="center" gutterBottom sx={{ mb: 4 }}>
        CÂMARA MUNICIPAL DE VEREADORES DE CANELINHA
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Typography variant="body2" gutterBottom>
            Número do Documento de Formalização de Demanda
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <TextField
              size="small"
              sx={{ width: 60 }}
            />
            <Typography variant="body1">/</Typography>
            <Select defaultValue={currentYear} size="small" sx={{ width: 100 }}>
              <MenuItem value={currentYear}>{currentYear}</MenuItem>
            </Select>
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="body2" gutterBottom>
            Data da Autorização
          </Typography>
          <TextField
            fullWidth
            size="small"
            type="date"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body2" gutterBottom>
            Descrição da Autorização
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            defaultValue="Na condição de responsável pela autorização de despesas, concedo AUTORIZAÇÃO para início de contratação referente ao Documento de Formalização de Demanda. Encaminho a presente ao setor de licitação, para as devidas providências."
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body2" gutterBottom>
            Presidente da Câmara
          </Typography>
          <TextField
            fullWidth
            size="small"
            defaultValue="ELOIR JOÃO REIS"
          />
        </Grid>

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
          <Button variant="outlined">
            Limpar
          </Button>
          <Button variant="contained">
            Gerar Autorização
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PresidentAuthorization;
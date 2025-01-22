import { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Paper,
  Select,
  MenuItem,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import jsPDF from 'jspdf';

interface Item {
  description: string;
  quantity: number;
  measure: string;
  monthlyValue: number;
  totalValue: number;
}

function FormalDemand() {
  const [items, setItems] = useState<Item[]>([{
    description: '',
    quantity: 1,
    measure: 'Mês',
    monthlyValue: 0,
    totalValue: 0
  }]);
  const [needsRiskAnalysis, setNeedsRiskAnalysis] = useState('no');
  const [unidadeDemandante, setUnidadeDemandante] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const currentYear = new Date().getFullYear();
  const [telefone, setTelefone] = useState('');
  const [dfdNumber, setDfdNumber] = useState(1);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Adicione esta constante com as unidades de medida
  const unidadesMedida = [
    'Mês',
    'Unidade',
    'Kg',
    'Litro',
    'Metro',
    'Metro²',
    'Metro³',
    'Caixa',
    'Pacote',
    'Hora'
  ];

  const formatarMoeda = (valor: number): string => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleAddItem = () => {
    setItems([...items, {
      description: '',
      quantity: 1,
      measure: 'Mês',
      monthlyValue: 0,
      totalValue: 0
    }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const formatarTelefone = (valor: string) => {
    // Remove tudo que não é número
    const apenasNumeros = valor.replace(/\D/g, '');
    
    // Formata o número conforme vai digitando
    if (apenasNumeros.length === 0) return '';
    if (apenasNumeros.length <= 2) return apenasNumeros;
    if (apenasNumeros.length <= 6) return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2)}`;
    if (apenasNumeros.length <= 10) return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 6)}-${apenasNumeros.slice(6)}`;
    return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7, 11)}`;
  };

  const handleTelefoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const valor = event.target.value.replace(/\D/g, '');
    setTelefone(formatarTelefone(valor));
  };

  const getYearOptions = () => {
    const startYear = 2024;
    const endYear = 2030;
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    return years;
  };

  const generatePDF = async () => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Definir estilos de fonte
    pdf.setFont('helvetica', 'normal');
    
    // Cabeçalho
    pdf.setFontSize(12);
    pdf.text('DOCUMENTO DE FORMALIZAÇÃO DE DEMANDA (DFD)', 105, 20, { align: 'center' });
    
    // Informações Básicas
    pdf.setFontSize(10);
    pdf.text(`Ano: ${currentYear}`, 20, 30);
    pdf.text(`Unidade Demandante: ${unidadeDemandante}`, 20, 37);
    pdf.text(`Responsável: ${responsavel}`, 20, 44);

    // Dados dos Itens
    pdf.setFontSize(10);
    pdf.text('RELAÇÃO DE ITENS', 105, 60, { align: 'center' });
    
    // Cabeçalho da Tabela
    const headers = ['Descrição', 'Quantidade', 'Unidade', 'Valor Mensal', 'Valor Total'];
    const startY = 70;
    const lineHeight = 7;
    
    // Desenhar tabela de itens
    pdf.setDrawColor(0);
    pdf.setLineWidth(0.5);
    
    items.forEach((item, index) => {
      const y = startY + (index * lineHeight);
      pdf.text(item.description, 20, y);
      pdf.text(item.quantity.toString(), 80, y);
      pdf.text(item.measure, 110, y);
      pdf.text(`R$ ${item.monthlyValue.toFixed(2)}`, 140, y);
      pdf.text(`R$ ${item.totalValue.toFixed(2)}`, 170, y);
      pdf.line(20, y + 2, 190, y + 2);
    });

    // Análise de Riscos
    pdf.text(`Necessita Análise de Riscos: ${needsRiskAnalysis === 'yes' ? 'Sim' : 'Não'}`, 20, startY + (items.length * lineHeight) + 20);

    // Rodapé
    pdf.text('Documento gerado automaticamente', 105, 280, { align: 'center' });

    // Salvar PDF
    pdf.save(`DFD_${currentYear}_${new Date().getTime()}.pdf`);
  };

  const handleSave = () => {
    // Lógica de salvamento existente
    generatePDF();
  };

  const handleClear = () => {
    // Limpar campos de estado
    setUnidadeDemandante('');
    setResponsavel('');
    setNeedsRiskAnalysis('no');
    
    // Resetar lista de itens para um item em branco
    setItems([{
      description: '',
      quantity: 1,
      measure: 'Mês',
      monthlyValue: 0,
      totalValue: 0
    }]);
    setTelefone('');
    setDfdNumber(1);
    setSelectedYear(currentYear);
  };

  const handleItemChange = (index: number, field: keyof Item, value: string | number) => {
    const newItems = [...items];
    const item = { ...newItems[index] };

    if (field === 'quantity') {
      item.quantity = Math.max(1, Number(value));
    } else if (field === 'monthlyValue') {
      // Remove formatação e converte para número
      const numeroLimpo = String(value).replace(/\D/g, '');
      item.monthlyValue = Number(numeroLimpo) / 100;
    } else {
      item[field] = value;
    }

    // Calcula o valor total
    item.totalValue = item.quantity * item.monthlyValue;

    newItems[index] = item;
    setItems(newItems);
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', p: 3 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          border: '1px solid rgba(0, 0, 0, 0.23)',
          borderRadius: 2
        }}
      >
        <Typography variant="h6" align="center" gutterBottom>
          DOCUMENTO DE FORMALIZAÇÃO DE DEMANDA
        </Typography>
        <Typography variant="subtitle2" align="center" gutterBottom>
          CÂMARA MUNICIPAL DE VEREADORES
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body2">DFD Nº</Typography>
                <TextField 
                  size="small" 
                  sx={{ width: 60 }} 
                  value={dfdNumber}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    setDfdNumber(Math.max(1, value)); // Não permite números menores que 1
                  }}
                  type="number"
                  inputProps={{ 
                    min: 1,
                    style: { textAlign: 'center' }
                  }}
                />
                <Typography variant="body2">/</Typography>
                <Select 
                  value={selectedYear} 
                  size="small" 
                  sx={{ width: 100 }}
                  onChange={(e) => setSelectedYear(e.target.value as number)}
                >
                  {getYearOptions().map((year) => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                defaultValue="Câmara de Vereadores de Canelinha"
                label="Órgão"
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                label="Setor requisitante"
                value={unidadeDemandante}
                onChange={(e) => setUnidadeDemandante(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                label="Responsável pela Demanda"
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                label="Matrícula"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                label="E-mail"
                type="email"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Telefone"
                value={telefone}
                onChange={handleTelefoneChange}
                placeholder="(00) 00000-0000"
                inputProps={{ 
                  maxLength: 15
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>1. Objeto</Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>2. Justificativa da necessidade da contratação</Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>3. Descrições e quantidades</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell width="40%">Descrição</TableCell>
                      <TableCell align="center" width="12%">Quant.</TableCell>
                      <TableCell align="center" width="15%">Medida</TableCell>
                      <TableCell align="center" width="15%">Valor Mês</TableCell>
                      <TableCell align="center" width="15%">Valor Total</TableCell>
                      <TableCell align="center">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <TextField 
                            size="small" 
                            fullWidth
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            multiline
                            rows={2}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                            sx={{ width: 50 }}
                            inputProps={{ 
                              min: 1,
                              style: { 
                                textAlign: 'center',
                                padding: '4px'
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Select 
                            size="small" 
                            value={item.measure}
                            onChange={(e) => handleItemChange(index, 'measure', e.target.value)}
                            sx={{ width: 90 }}
                          >
                            {unidadesMedida.map((unidade) => (
                              <MenuItem key={unidade} value={unidade}>
                                {unidade}
                              </MenuItem>
                            ))}
                          </Select>
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            value={formatarMoeda(item.monthlyValue)}
                            onChange={(e) => handleItemChange(index, 'monthlyValue', e.target.value)}
                            sx={{ width: 100 }}
                            inputProps={{
                              style: { textAlign: 'right' }
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            value={formatarMoeda(item.totalValue)}
                            sx={{ 
                              width: 100,
                              '& .MuiInputBase-input': {
                                color: 'text.primary',
                                WebkitTextFillColor: 'unset',
                                cursor: 'default'
                              },
                              '& .MuiOutlinedInput-root': {
                                '&.Mui-disabled': {
                                  '& fieldset': {
                                    borderColor: 'rgba(0, 0, 0, 0.23)'
                                  }
                                }
                              }
                            }}
                            inputProps={{
                              style: { textAlign: 'right' }
                            }}
                            disabled
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleRemoveItem(index)}
                          >
                            Remover
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button
                variant="contained"
                size="small"
                onClick={handleAddItem}
                sx={{ mt: 1 }}
              >
                Adicionar Item
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>4. Grau de prioridade da compra</Typography>
              <Select fullWidth size="small" defaultValue="Alto">
                <MenuItem value="Alto">Alto</MenuItem>
                <MenuItem value="Médio">Médio</MenuItem>
                <MenuItem value="Baixo">Baixo</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>5. Necessita de análise de riscos</Typography>
              <RadioGroup
                row
                value={needsRiskAnalysis}
                onChange={(e) => setNeedsRiskAnalysis(e.target.value)}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Sim" />
                <FormControlLabel value="no" control={<Radio />} label="Não" />
              </RadioGroup>
              {needsRiskAnalysis === 'yes' && (
                <TextField
                  fullWidth
                  size="small"
                  label="Justificativa"
                />
              )}
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>6. Previsão no PCA</Typography>
              <RadioGroup row defaultValue="no">
                <FormControlLabel value="yes" control={<Radio />} label="Sim" />
                <FormControlLabel value="no" control={<Radio />} label="Não, precisa incluir" />
              </RadioGroup>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>7. Estimativa de valor</Typography>
              <TextField
                fullWidth
                size="small"
                InputProps={{
                  startAdornment: <Typography>R$</Typography>
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>8. Prazo de entrega/execução</Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>9. Recursos orçamentários</Typography>
              <Typography variant="body2" paragraph>
                9.1 Os recursos necessários para a contratação do empresa serão previstos no orçamento do ano vigente, na dotação
                orçamentária específica da Câmara de Vereadores de Canelinha-SC, na seguinte rubrica:
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">Órgão</Typography>
                  <TextField size="small" placeholder="Número" fullWidth sx={{ mb: 1 }} />
                  <TextField size="small" placeholder="Nome do órgão" fullWidth />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Unidade</Typography>
                  <TextField size="small" placeholder="Número" fullWidth sx={{ mb: 1 }} />
                  <TextField size="small" placeholder="Nome da unidade" fullWidth />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Natureza</Typography>
                  <TextField size="small" placeholder="Código" fullWidth sx={{ mb: 1 }} />
                  <TextField size="small" placeholder="Descrição da natureza" fullWidth />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Fonte</Typography>
                  <TextField size="small" placeholder="Código" fullWidth sx={{ mb: 1 }} />
                  <TextField size="small" placeholder="Descrição da fonte" fullWidth />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>10. Local e horário da entrega/execução</Typography>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <TextField fullWidth size="small" label="Rua" />
                </Grid>
                <Grid item xs={4}>
                  <TextField fullWidth size="small" label="Número" />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth size="small" label="Bairro" />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth size="small" label="Cidade" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth size="small" label="Estado" />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>11. Vinculado ou dependente da contratação de outro DFD</Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>12. Indicação do fiscal do contrato</Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                type="date"
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                label="Presidente do Legislativo"
              />
            </Grid>

            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button 
                variant="outlined" 
                onClick={handleClear}
              >
                Limpar
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSave}
              >
                Salvar e Gerar PDF
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}

export default FormalDemand;
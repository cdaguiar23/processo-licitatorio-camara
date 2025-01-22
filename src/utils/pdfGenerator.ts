import jsPDF from 'jspdf';
import { Item } from '../types';

interface PDFData {
  currentYear: number;
  unidadeDemandante: string;
  responsavel: string;
  items: Item[];
  needsRiskAnalysis: string;
  dfdNumber: number;
  selectedYear: number;
  telefone: string;
  matricula: string;
  email: string;
  objeto: string;
  justificativa: string;
  prioridade: string;
  previsaoPCA: string;
  estimativaValor: string;
  prazoEntrega: string;
  // Dados orçamentários
  orgaoNumero: string;
  orgaoNome: string;
  unidadeNumero: string;
  unidadeNome: string;
  naturezaCodigo: string;
  naturezaDescricao: string;
  fonteCodigo: string;
  fonteDescricao: string;
  // Endereço
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  vinculadoDFD: string;
  fiscalContrato: string;
  presidenteLegislativo: string;
}

export const generatePDF = async ({
  currentYear,
  unidadeDemandante,
  responsavel,
  items,
  needsRiskAnalysis,
  dfdNumber,
  selectedYear,
  telefone,
  matricula,
  email,
  objeto,
  justificativa,
  prioridade,
  previsaoPCA,
  estimativaValor,
  prazoEntrega,
  orgaoNumero,
  orgaoNome,
  unidadeNumero,
  unidadeNome,
  naturezaCodigo,
  naturezaDescricao,
  fonteCodigo,
  fonteDescricao,
  rua,
  numero,
  bairro,
  cidade,
  estado,
  vinculadoDFD,
  fiscalContrato,
  presidenteLegislativo
}: PDFData): Promise<void> => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Configurações iniciais
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let currentY = 20;
  const lineHeight = 7;
  const footerHeight = 30; // Altura reservada para o rodapé
  const maxY = pageHeight - footerHeight; // Ajustado para respeitar o rodapé

  // Função para verificar e adicionar nova página
  const checkNewPage = (requiredSpace: number = lineHeight) => {
    if (currentY + requiredSpace > maxY) {
      pdf.addPage();
      currentY = 20;
      return true;
    }
    return false;
  };

  // Funções auxiliares
  const centerText = (text: string, y: number) => {
    const textWidth = pdf.getStringUnitWidth(text) * pdf.getFontSize() / pdf.internal.scaleFactor;
    const x = (pageWidth - textWidth) / 2;
    pdf.text(text, x, y);
  };

  const drawHorizontalLine = (y: number) => {
    pdf.line(margin, y, pageWidth - margin, y);
  };

  // Carrega a logo
  const loadImage = (): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      try {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = '/logo_camara.jpg';
        
        img.onload = () => resolve(img);
        img.onerror = (e) => {
          console.warn('Erro ao carregar a logo:', e);
          resolve(null as any);
        };
      } catch (error) {
        console.warn('Erro ao carregar imagem:', error);
        resolve(null as any);
      }
    });
  };

  // Carrega e adiciona a logo
  try {
    const logoImage = await loadImage();
    if (logoImage) {
      const logoWidth = 20;
      const logoHeight = 20;
      const logoX = margin + 5;
      const logoY = 15;
      
      pdf.addImage(
        logoImage,
        'JPEG', // Alterado para JPEG já que a imagem é .jpg
        logoX,
        logoY,
        logoWidth,
        logoHeight
      );
    }
  } catch (error) {
    console.warn('Erro ao processar a logo:', error);
  }

  // Cabeçalho padrão
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  centerText('ESTADO DE SANTA CATARINA', currentY);
  currentY += lineHeight;
  centerText('CÂMARA MUNICIPAL DE VEREADORES DE CANELINHA', currentY);
  currentY += lineHeight;
  
  // Endereço
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  centerText('Rua Manoel Francisco Correa, nº 417 – caixa postal 02', currentY);
  currentY += lineHeight;
  centerText('88230-000 – Canelinha – SC – CNPJ: 00.525.967/0001-97', currentY);
  currentY += lineHeight;
  
  // Linha divisória após o cabeçalho
  currentY += lineHeight/2;
  drawHorizontalLine(currentY);
  
  // Título do documento
  currentY += lineHeight * 2;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  centerText('DOCUMENTO DE FORMALIZAÇÃO DE DEMANDA - DFD', currentY);
  
  // Número do DFD e Ano
  currentY += lineHeight * 2;
  pdf.setFontSize(11);
  pdf.text(`DFD Nº ${dfdNumber.toString().padStart(3, '0')}/${selectedYear}`, margin, currentY);
  
  // Informações do Setor e Responsável
  currentY += lineHeight * 2;
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Setor Requisitante: ${unidadeDemandante}`, margin, currentY);
  currentY += lineHeight;
  pdf.text(`Responsável pela Demanda: ${responsavel}`, margin, currentY);
  currentY += lineHeight;
  pdf.text(`Matrícula: ${matricula}`, margin, currentY);
  pdf.text(`E-mail: ${email}`, margin + contentWidth/2, currentY);
  currentY += lineHeight;
  pdf.text(`Telefone: ${telefone}`, margin, currentY);
  
  // 1. Objeto
  currentY += lineHeight * 2;
  pdf.setFont('helvetica', 'bold');
  pdf.text('1. Objeto', margin, currentY);
  pdf.setFont('helvetica', 'normal');
  currentY += lineHeight;
  const objetoLines = pdf.splitTextToSize(objeto, contentWidth);
  pdf.text(objetoLines, margin, currentY);
  currentY += objetoLines.length * lineHeight;

  // 2. Justificativa
  currentY += lineHeight;
  pdf.setFont('helvetica', 'bold');
  pdf.text('2. Justificativa da necessidade da contratação', margin, currentY);
  pdf.setFont('helvetica', 'normal');
  currentY += lineHeight;
  const justificativaLines = pdf.splitTextToSize(justificativa, contentWidth);
  pdf.text(justificativaLines, margin, currentY);
  currentY += justificativaLines.length * lineHeight;

  // 3. Descrições e quantidades
  currentY += lineHeight;
  pdf.setFont('helvetica', 'bold');
  pdf.text('3. Descrições e quantidades', margin, currentY);
  currentY += lineHeight;

  // Tabela de itens
  const colWidths = [80, 25, 25, 30, 30];
  const headers = ['Descrição', 'Quant.', 'Medida', 'Valor Mensal', 'Valor Total'];
  let currentX = margin;
  
  headers.forEach((header, index) => {
    pdf.text(header, currentX, currentY);
    currentX += colWidths[index];
  });
  
  drawHorizontalLine(currentY + 1);
  
  items.forEach((item) => {
    currentY += lineHeight;
    currentX = margin;
    
    const descriptionLines = pdf.splitTextToSize(item.description, colWidths[0] - 2);
    pdf.setFont('helvetica', 'normal');
    pdf.text(descriptionLines, currentX, currentY);
    currentX += colWidths[0];
    
    pdf.text(item.quantity.toString(), currentX, currentY);
    currentX += colWidths[1];
    
    pdf.text(item.measure, currentX, currentY);
    currentX += colWidths[2];
    
    pdf.text(formatarMoeda(item.monthlyValue), currentX, currentY);
    currentX += colWidths[3];
    
    pdf.text(formatarMoeda(item.totalValue), currentX, currentY);
    
    currentY += Math.max((descriptionLines.length - 1) * 5, 0);
    drawHorizontalLine(currentY + 2);
  });

  // Valor Total Geral
  const totalGeral = items.reduce((sum, item) => sum + item.totalValue, 0);
  currentY += lineHeight * 2;
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Valor Total: ${formatarMoeda(totalGeral)}`, pageWidth - margin - 50, currentY);

  // 4. Grau de prioridade
  currentY += lineHeight * 2;
  pdf.text('4. Grau de prioridade da compra', margin, currentY);
  currentY += lineHeight;
  pdf.setFont('helvetica', 'normal');
  pdf.text(prioridade, margin, currentY);

  // 5. Análise de riscos
  currentY += lineHeight * 2;
  pdf.setFont('helvetica', 'bold');
  pdf.text('5. Necessita de análise de riscos', margin, currentY);
  currentY += lineHeight;
  pdf.setFont('helvetica', 'normal');
  pdf.text(needsRiskAnalysis === 'yes' ? 'Sim' : 'Não', margin, currentY);

  // 6. Previsão no PCA
  currentY += lineHeight * 2;
  pdf.setFont('helvetica', 'bold');
  pdf.text('6. Previsão no PCA', margin, currentY);
  currentY += lineHeight;
  pdf.setFont('helvetica', 'normal');
  pdf.text(previsaoPCA === 'yes' ? 'Sim' : 'Não, precisa incluir', margin, currentY);

  // 7. Estimativa de valor
  currentY += lineHeight * 2;
  pdf.setFont('helvetica', 'bold');
  pdf.text('7. Estimativa de valor', margin, currentY);
  currentY += lineHeight;
  pdf.setFont('helvetica', 'normal');
  pdf.text(formatarMoeda(Number(estimativaValor) || 0), margin, currentY);

  // Verifica espaço necessário para a seção 8
  const prazoLines = pdf.splitTextToSize(prazoEntrega, contentWidth);
  const espacoNecessario = (prazoLines.length + 2) * lineHeight; // +2 para título e espaçamento

  // Se não houver espaço suficiente, cria nova página
  if (currentY + espacoNecessario > maxY) {
    pdf.addPage();
    currentY = 20;
  }

  // 8. Prazo de entrega
  currentY += lineHeight * 2;
  pdf.setFont('helvetica', 'bold');
  pdf.text('8. Prazo de entrega/execução', margin, currentY);
  currentY += lineHeight;
  pdf.setFont('helvetica', 'normal');
  pdf.text(prazoLines, margin, currentY);
  currentY += prazoLines.length * lineHeight;

  // Verifica espaço para próxima seção
  if (currentY + lineHeight * 6 > maxY) {
    pdf.addPage();
    currentY = 20;
  }

  // 9. Recursos orçamentários
  checkNewPage(lineHeight * 10); // Espaço necessário para a seção
  currentY += lineHeight;
  pdf.setFont('helvetica', 'bold');
  pdf.text('9. Recursos orçamentários', margin, currentY);
  currentY += lineHeight;
  pdf.setFont('helvetica', 'normal');
  pdf.text('9.1 Os recursos necessários serão previstos no orçamento do ano vigente:', margin, currentY);
  
  currentY += lineHeight * 1.5;
  pdf.text(`Órgão: ${orgaoNumero} - ${orgaoNome}`, margin, currentY);
  currentY += lineHeight;
  pdf.text(`Unidade: ${unidadeNumero} - ${unidadeNome}`, margin, currentY);
  currentY += lineHeight;
  pdf.text(`Natureza: ${naturezaCodigo} - ${naturezaDescricao}`, margin, currentY);
  currentY += lineHeight;
  pdf.text(`Fonte: ${fonteCodigo} - ${fonteDescricao}`, margin, currentY);

  // 10. Local de entrega
  checkNewPage(lineHeight * 6);
  currentY += lineHeight * 2;
  pdf.setFont('helvetica', 'bold');
  pdf.text('10. Local e horário da entrega/execução', margin, currentY);
  currentY += lineHeight;
  pdf.setFont('helvetica', 'normal');
  pdf.text(`${rua}, ${numero}`, margin, currentY);
  currentY += lineHeight;
  pdf.text(`${bairro} - ${cidade}/${estado}`, margin, currentY);

  // 11. Vinculado a outro DFD
  checkNewPage(lineHeight * 6);
  currentY += lineHeight * 2;
  pdf.setFont('helvetica', 'bold');
  pdf.text('11. Vinculado ou dependente da contratação de outro DFD', margin, currentY);
  currentY += lineHeight;
  pdf.setFont('helvetica', 'normal');
  const vinculadoLines = pdf.splitTextToSize(vinculadoDFD || 'Não', contentWidth);
  pdf.text(vinculadoLines, margin, currentY);
  currentY += vinculadoLines.length * lineHeight;

  // 12. Fiscal do contrato
  checkNewPage(lineHeight * 6);
  currentY += lineHeight;
  pdf.setFont('helvetica', 'bold');
  pdf.text('12. Indicação do fiscal do contrato', margin, currentY);
  currentY += lineHeight;
  pdf.setFont('helvetica', 'normal');
  const fiscalLines = pdf.splitTextToSize(fiscalContrato, contentWidth);
  pdf.text(fiscalLines, margin, currentY);
  currentY += fiscalLines.length * lineHeight;

  // Data e assinaturas (agora logo após o item 12)
  currentY += lineHeight * 3;
  checkNewPage(lineHeight * 8);
  
  // Data
  pdf.text('Canelinha, _____ de _______________ de ' + currentYear, margin, currentY);
  
  // Assinatura
  currentY += lineHeight * 3;
  drawHorizontalLine(currentY);
  pdf.setFontSize(10);
  centerText(presidenteLegislativo, currentY + 5);
  centerText('Presidente do Legislativo', currentY + 10);

  // Salvar PDF
  pdf.save('Documento de Formalização de Demanda.pdf');
};

// Função auxiliar para formatar moeda
const formatarMoeda = (valor: number): string => {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}; 
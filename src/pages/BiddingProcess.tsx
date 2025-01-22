import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Paper, Stepper, Step, StepLabel, Button, Box } from '@mui/material';
import FormalDemand from '../forms/FormalDemand';
import PresidentAuthorization from '../forms/PresidentAuthorization';
import Notice from '../forms/Notice';
import PreliminaryStudy from '../forms/PremilinaryStudy';
import ContractDraft from '../forms/ContractDraft';
import { BiddingType } from '../types';
import RatificationTerm from '../forms/RatificationTerm';
import ContractorChoice from '../forms/ContractorChoice';
import ReferenceTerms from '../forms/ReferenceTerms';

const steps = [
  'Documento de Formalização de Demanda',
  'Autorização do Presidente',
  'Edital',
  'Estudo Técnico Preliminar',
  'Minuta do Contrato',
  'Termo de Ratificação de Escolha',
  'Razão da Escolha da Contratada',
  'Termo de Referência'
] as const;

function BiddingProcess() {
  const [activeStep, setActiveStep] = useState(0);
  const { type } = useParams<{ type: BiddingType }>();

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <FormalDemand />;
      case 1:
        return <PresidentAuthorization />;
      case 2:
        return <Notice />;
      case 3:
        return <PreliminaryStudy />;
      case 4:
        return <ContractDraft />;
      case 5:
        return <RatificationTerm />;
      case 6:
        return <ContractorChoice />;
      case 7:
        return <ReferenceTerms />;
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container>
      <Paper sx={{ p: 3, mt: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 4 }}>
          {activeStep === steps.length ? (
            <Box sx={{ textAlign: 'center' }}>
              <h2>Processo Finalizado</h2>
              <Button onClick={() => setActiveStep(0)}>Voltar ao Início</Button>
            </Box>
          ) : (
            <>
              {getStepContent(activeStep)}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mt: 3 
              }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {activeStep > 0 && (
                    <Button 
                      variant="outlined" 
                      onClick={handleBack}
                    >
                      Voltar
                    </Button>
                  )}
                  {activeStep < steps.length - 1 && (
                    <Button 
                      variant="contained" 
                      onClick={handleNext}
                    >
                      Próximo
                    </Button>
                  )}
                </Box>
                {/* Existing buttons like Clear and Save can be added here */}
              </Box>
            </>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default BiddingProcess;
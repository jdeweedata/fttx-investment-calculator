import React, { useState } from 'react';
import { Box, Heading, SimpleGrid, VStack, HStack, Text, Button, Icon, Spinner } from '@chakra-ui/react';
import { FiDollarSign, FiTrendingUp, FiPieChart, FiPercent } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import InputForm from './components/InputForm';
import ResultCard from './components/ResultCard';
import { getLocationResearch, getInvestmentAnalysis } from './services/aiService';

const FTTxFeasibilityCalculator = () => {
  const [inputs, setInputs] = useState({
    city: '',
    municipality: '',
    province: '',
    areaType: '',
    targetMarket: '',
    costPremisesPassed: 3800,
    costPremiseConnected: 1500,
    costONUInstalled: 334,
    costGPONHardware: 73999,
    numPremises: 3800,
    potentialServiceUptake: 47,
    targetedARPU: 347,
    projectTimeline: 4,
    opex: 15,
    customerAcquisitionCost: 200,
    annualChurnRate: 3,
    financingRate: 12,
    inflationRate: 0
  });

  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState({ cashFlow: [], cumulativeNPV: [] });
  const [locationInsights, setLocationInsights] = useState('');
  const [investmentAnalysis, setInvestmentAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const renderStructuredContent = (content) => {
    return content.split('\n\n').map((paragraph, index) => (
      <Text key={index} mb={4}>
        {paragraph}
      </Text>
    ));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(value);
  };

  const calculateFeasibility = async () => {
    const numInputs = Object.fromEntries(
      Object.entries(inputs).map(([key, value]) => [key, key === 'city' || key === 'municipality' || key === 'province' || key === 'areaType' || key === 'targetMarket' ? value : Number(value)])
    );

    const totalPremises = numInputs.numPremises;
    const connectedPremises = totalPremises * (numInputs.potentialServiceUptake / 100);
    const totalCapex = (numInputs.costPremisesPassed * totalPremises) + 
                       (numInputs.costPremiseConnected * connectedPremises) + 
                       (numInputs.costONUInstalled * connectedPremises) + 
                       numInputs.costGPONHardware;
    
    const annualRevenue = connectedPremises * numInputs.targetedARPU * 12;
    const annualOpex = annualRevenue * (numInputs.opex / 100);
    const annualCustomerAcquisitionCost = numInputs.customerAcquisitionCost * (connectedPremises * (numInputs.annualChurnRate / 100));
    
    const annualCashFlow = annualRevenue - annualOpex - annualCustomerAcquisitionCost;
    
    const npv = calculateNPV(totalCapex, annualCashFlow, numInputs.financingRate, numInputs.projectTimeline);
    const irr = calculateIRR(totalCapex, annualCashFlow, numInputs.projectTimeline);
    const paybackPeriod = totalCapex / annualCashFlow;
    const roi = (npv / totalCapex) * 100;

    const cashFlowData = [];
    const cumulativeNPVData = [];
    let cumulativeNPV = -totalCapex;

    for (let year = 1; year <= numInputs.projectTimeline; year++) {
      const yearlyRevenue = annualRevenue * Math.pow(1 + numInputs.inflationRate / 100, year - 1);
      const yearlyOpex = annualOpex * Math.pow(1 + numInputs.inflationRate / 100, year - 1);
      const yearlyCashFlow = yearlyRevenue - yearlyOpex;
      
      cashFlowData.push({ year, cashFlow: yearlyCashFlow });
      
      cumulativeNPV += yearlyCashFlow / Math.pow(1 + numInputs.financingRate / 100, year);
      cumulativeNPVData.push({ year, npv: cumulativeNPV });
    }

    const newResults = {
      totalCapex,
      annualRevenue,
      annualOpex,
      annualCashFlow,
      npv,
      irr,
      paybackPeriod,
      roi
    };

    setResults(newResults);
    setChartData({
      cashFlow: cashFlowData,
      cumulativeNPV: cumulativeNPVData
    });

    setIsLoading(true);
    try {
      const research = await getLocationResearch(inputs.city, inputs.municipality, inputs.province);
      setLocationInsights(research);

      const analysis = await getInvestmentAnalysis(inputs, newResults);
      setInvestmentAnalysis(analysis);
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      setLocationInsights('An error occurred while fetching location insights.');
      setInvestmentAnalysis('An error occurred while fetching investment analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateNPV = (initialInvestment, cashFlow, rate, years) => {
    let npv = -initialInvestment;
    for (let i = 1; i <= years; i++) {
      npv += cashFlow / Math.pow(1 + rate / 100, i);
    }
    return npv;
  };

  const calculateIRR = (initialInvestment, cashFlow, years) => {
    const epsilon = 0.1;
    let guess = 10;
    
    const f = (rate) => {
      let npv = -initialInvestment;
      for (let i = 1; i <= years; i++) {
        npv += cashFlow / Math.pow(1 + rate / 100, i);
      }
      return npv;
    };
    
    while (Math.abs(f(guess)) > epsilon) {
      guess = guess - f(guess) / ((f(guess + epsilon) - f(guess)) / epsilon);
    }
    
    return guess;
  };

  const KeyMetric = ({ title, value, icon, positive = true }) => (
    <Box bg="white" p={6} rounded="lg" shadow="md">
      <HStack spacing={4}>
        <Box p={3} bg={positive ? "green.100" : "red.100"} color={positive ? "green.600" : "red.600"} rounded="full">
          <Icon as={icon} boxSize={6} />
        </Box>
        <VStack align="start" spacing={0}>
          <Text fontSize="sm" fontWeight="medium" color="gray.500">{title}</Text>
          <Text fontSize="2xl" fontWeight="semibold" color={positive ? "green.600" : "red.600"}>{value}</Text>
        </VStack>
      </HStack>
    </Box>
  );

  return (
    <Box minH="100vh" bg="gray.100">
      <Box as="header" bg="white" shadow="sm">
        <Box maxW="7xl" mx="auto" py={6} px={{ base: 4, sm: 6, lg: 8 }}>
          <Heading as="h1" size="xl" color="gray.900">
            FTTx Investment Feasibility Calculator
          </Heading>
        </Box>
      </Box>
      <Box as="main" maxW="7xl" mx="auto" py={6} px={{ base: 4, sm: 6, lg: 8 }}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          <KeyMetric 
            title="Total CAPEX" 
            value={results ? formatCurrency(results.totalCapex) : '-'}
            icon={FiDollarSign}
          />
          <KeyMetric 
            title="Annual Revenue" 
            value={results ? formatCurrency(results.annualRevenue) : '-'}
            icon={FiTrendingUp}
          />
          <KeyMetric 
            title="NPV" 
            value={results ? formatCurrency(results.npv) : '-'}
            icon={FiPieChart}
            positive={results ? results.npv > 0 : true}
          />
          <KeyMetric 
            title="IRR" 
            value={results ? `${results.irr.toFixed(2)}%` : '-'}
            icon={FiPercent}
            positive={results ? results.irr > inputs.financingRate : true}
          />
        </SimpleGrid>

        {results && (
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} mb={8}>
            <Box bg="white" p={6} rounded="lg" shadow="md">
              <Heading as="h2" size="lg" mb={4}>Cash Flow Projection</Heading>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.cashFlow}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="cashFlow" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
            <Box bg="white" p={6} rounded="lg" shadow="md">
              <Heading as="h2" size="lg" mb={4}>Cumulative NPV</Heading>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.cumulativeNPV}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="npv" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </SimpleGrid>
        )}

        <Box bg="white" rounded="lg" shadow="md">
          <Box p={6}>
            <Heading as="h3" size="lg" mb={4}>Investment Parameters</Heading>
            <InputForm inputs={inputs} setInputs={setInputs} />
          </Box>
          <Box px={6} py={3} bg="gray.50" roundedBottom="lg">
            <Button
              onClick={calculateFeasibility}
              colorScheme="blue"
              size="lg"
              width="full"
            >
              Calculate Feasibility
            </Button>
          </Box>
        </Box>

        {isLoading && (
          <Box position="fixed" top="0" left="0" right="0" bottom="0" bg="rgba(0,0,0,0.5)" zIndex="9999" display="flex" alignItems="center" justifyContent="center">
            <Spinner size="xl" color="white" />
          </Box>
        )}

        {results && (
          <>
            <ResultCard results={results} inputs={inputs} formatCurrency={formatCurrency} />
            
            <SimpleGrid columns={1} spacing={8} mt={8}>
              <Box bg="white" shadow="md" rounded="lg" p={6}>
                <Heading as="h3" size="lg" mb={4}>Location Insights</Heading>
                {renderStructuredContent(locationInsights)}
              </Box>

              <Box bg="white" shadow="md" rounded="lg" p={6}>
                <Heading as="h3" size="lg" mb={4}>Investment Analysis</Heading>
                {renderStructuredContent(investmentAnalysis)}
              </Box>
            </SimpleGrid>
          </>
        )}
      </Box>
    </Box>
  );
};

export default FTTxFeasibilityCalculator;
import React from 'react';
import { Box, VStack, SimpleGrid, Text, Heading } from '@chakra-ui/react';

const ResultCard = ({ results, inputs, formatCurrency }) => (
  <Box bg="white" shadow="md" rounded="lg" mt={8}>
    <Box px={6} py={5}>
      <Heading as="h3" size="lg">Feasibility Results</Heading>
    </Box>
    <Box borderTopWidth={1} borderColor="gray.200">
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} px={6} py={5}>
        <VStack align="start" spacing={1}>
          <Text fontWeight="medium" color="gray.500">Total CAPEX</Text>
          <Text fontSize="lg">{formatCurrency(results.totalCapex)}</Text>
        </VStack>
        <VStack align="start" spacing={1}>
          <Text fontWeight="medium" color="gray.500">Annual Revenue</Text>
          <Text fontSize="lg">{formatCurrency(results.annualRevenue)}</Text>
        </VStack>
        <VStack align="start" spacing={1}>
          <Text fontWeight="medium" color="gray.500">Annual OPEX</Text>
          <Text fontSize="lg">{formatCurrency(results.annualOpex)}</Text>
        </VStack>
        <VStack align="start" spacing={1}>
          <Text fontWeight="medium" color="gray.500">Annual Cash Flow</Text>
          <Text fontSize="lg">{formatCurrency(results.annualCashFlow)}</Text>
        </VStack>
        <VStack align="start" spacing={1}>
          <Text fontWeight="medium" color="gray.500">Net Present Value (NPV)</Text>
          <Text fontSize="lg">{formatCurrency(results.npv)}</Text>
        </VStack>
        <VStack align="start" spacing={1}>
          <Text fontWeight="medium" color="gray.500">Internal Rate of Return (IRR)</Text>
          <Text fontSize="lg">{results.irr.toFixed(2)}%</Text>
        </VStack>
        <VStack align="start" spacing={1}>
          <Text fontWeight="medium" color="gray.500">Payback Period</Text>
          <Text fontSize="lg">{results.paybackPeriod.toFixed(2)} years</Text>
        </VStack>
        <VStack align="start" spacing={1}>
          <Text fontWeight="medium" color="gray.500">Return on Investment (ROI)</Text>
          <Text fontSize="lg">{results.roi.toFixed(2)}%</Text>
        </VStack>
      </SimpleGrid>
    </Box>
    <Box px={6} py={5}>
      <Heading as="h4" size="md" mb={2}>Investment Decision Recommendation</Heading>
      <Text color="gray.600">
        {results.npv > 0 && results.irr > inputs.financingRate
          ? "Based on the positive NPV and IRR exceeding the financing rate, this investment appears financially viable. However, consider other factors such as market conditions, competition, and regulatory environment before making a final decision."
          : "The investment may not be financially viable at this time. Consider adjusting your parameters or exploring alternative strategies."}
      </Text>
    </Box>
  </Box>
);

export default ResultCard;
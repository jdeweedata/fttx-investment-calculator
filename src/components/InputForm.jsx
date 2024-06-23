import React from 'react';
import { VStack, SimpleGrid, FormControl, FormLabel, Input, Select, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Text } from '@chakra-ui/react';

const InputForm = ({ inputs, setInputs }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prevInputs => ({
      ...prevInputs,
      [name]: value
    }));
  };

  const handleSliderChange = (name, value) => {
    setInputs(prevInputs => ({
      ...prevInputs,
      [name]: value
    }));
  };

  const renderInput = (label, name, type = "text", min = 0, max = 100, step = 1) => (
    <FormControl>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      {type === "slider" ? (
        <VStack spacing={2} align="stretch">
          <Slider
            id={name}
            min={min}
            max={max}
            step={step}
            value={inputs[name]}
            onChange={(value) => handleSliderChange(name, value)}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <Text>{inputs[name]}</Text>
        </VStack>
      ) : (
        <Input
          id={name}
          name={name}
          type={type}
          value={inputs[name]}
          onChange={handleInputChange}
        />
      )}
    </FormControl>
  );

  return (
    <VStack spacing={6}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} width="full">
        {renderInput("City/Town", "city")}
        {renderInput("Municipality", "municipality")}
        {renderInput("Province", "province")}
        <FormControl>
          <FormLabel htmlFor="areaType">Area Type</FormLabel>
          <Select
            id="areaType"
            name="areaType"
            value={inputs.areaType}
            onChange={handleInputChange}
          >
            <option value="">Select area type</option>
            <option value="Urban">Urban</option>
            <option value="Peri-urban">Peri-urban</option>
            <option value="Rural">Rural</option>
            <option value="Township">Township</option>
          </Select>
        </FormControl>
        {renderInput("Target Market", "targetMarket")}
        {renderInput("Cost per Premises Passed (ZAR)", "costPremisesPassed", "slider", 0, 10000, 100)}
        {renderInput("Cost per Premise Connected (ZAR)", "costPremiseConnected", "slider", 0, 5000, 50)}
        {renderInput("Cost per ONU Installed (ZAR)", "costONUInstalled", "slider", 0, 1000, 10)}
        {renderInput("Cost of GPON Hardware (ZAR)", "costGPONHardware", "slider", 0, 100000, 1000)}
        {renderInput("Number of Premises", "numPremises", "slider", 0, 10000, 100)}
        {renderInput("Potential Service Uptake (%)", "potentialServiceUptake", "slider", 0, 100, 1)}
        {renderInput("Targeted ARPU (ZAR)", "targetedARPU", "slider", 0, 1000, 10)}
        {renderInput("Project Timeline (Years)", "projectTimeline", "slider", 1, 20, 1)}
        {renderInput("OPEX (% of Revenue)", "opex", "slider", 0, 100, 1)}
        {renderInput("Customer Acquisition Cost (ZAR)", "customerAcquisitionCost", "slider", 0, 1000, 10)}
        {renderInput("Annual Churn Rate (%)", "annualChurnRate", "slider", 0, 20, 0.5)}
        {renderInput("Financing Rate (%)", "financingRate", "slider", 0, 20, 0.5)}
        {renderInput("Inflation Rate (%)", "inflationRate", "slider", 0, 20, 0.5)}
      </SimpleGrid>
    </VStack>
  );
};

export default InputForm;
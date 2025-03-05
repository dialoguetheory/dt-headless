import React, { useState } from 'react';

// Active components
const activeSectionComponents = {
  Basic: React.lazy(() => import('./Basic/Basic')),
  Accordion: React.lazy(() => import('./Accordion/Accordion')),
  MediaSlider: React.lazy(() => import('./MediaSlider/MediaSlider')),
};

// Is this section allowed and is there a corresponding component
function allowedSection(sectionType) {
    return activeSectionComponents.hasOwnProperty(sectionType);
}

// Component for rendering individual sections
const SectionRenderer = ({ sectionType, sectionData, args, dataFromPrevious, onDataPass }) => {

    const SectionComponent = activeSectionComponents[sectionType];
  
    if (!SectionComponent) {
      console.warn(`Section type "${sectionType}" not yet registered!`);
      return null;
    }

    // Render the dynamically imported component
    return (
      <React.Suspense fallback={<div>Loading {sectionType}...</div>}>
        <SectionComponent
          {...sectionData}
          {...args}
          dataFromPrevious={dataFromPrevious}
          onDataPass={onDataPass} // Pass onDataPass to the section component
        />
      </React.Suspense>
    );
};

const AdditionalSections = ({ sections }) => {

  if (!sections || sections.length === 0) {
    return null;
  }
  
  let prevSectionType = null;
  let sectionRepeatCount = 0;
  let allSectionTypes = [];

  const [dataFlow, setDataFlow] = useState({}); // Object to store data for each component

  const handleData = (index, data) => {
    setDataFlow((prev) => ({ ...prev, [index + 1]: data }));
  };

  sections.forEach(section => {
    if (section.fieldGroupName.startsWith("AdditionalSections")) {
        allSectionTypes.push(section.fieldGroupName);
    }
    if (section.items && Array.isArray(section.items)) {
        section.items.forEach(item => {
          if (item.fieldGroupName && item.fieldGroupName.startsWith("AdditionalSections")) {
              allSectionTypes.push(item.fieldGroupName);
          }
        });
    }
  });

  return (
    <>
      {sections.map((section, index) => {

        const sectionType = StripWordsFromLayoutName(section.fieldGroupName);

        if (!allowedSection(sectionType)) {
          console.warn(`Section type "${sectionType}" not allowed!`);
          return null;
        }

        // Same section type as the previous one?
        if (sectionType === prevSectionType) {
          sectionRepeatCount++;
        } else {
          sectionRepeatCount = 0;
        }

        // Count how many times this section type appears on the page
        const onPageCount =
          allSectionTypes.filter((type) => type === sectionType).length + 1;

        const args = {
          onPageCount: onPageCount,
          repeatCount: sectionRepeatCount,
          repeatIsOdd: sectionRepeatCount % 2 !== 0,
          sectionClasses: '',
          index: index
        };

        // Check if the next section is the same type
        if ( sections[index + 1]){
          const nextSection = StripWordsFromLayoutName(sections[index + 1].fieldGroupName);
          if(nextSection === sectionType) {
           args.sectionClasses += 'next-is-same';
          }
        }

        // Update tracking variables
        prevSectionType = sectionType;
        allSectionTypes.push(sectionType);
        return (
            <SectionRenderer
              key={index}
              sectionType={sectionType}
              sectionData={section}
              args={args}
              dataFromPrevious={dataFlow[index] || {}}
              onDataPass={(data) => handleData(index, data)}
            />
          );
      })}
    </>
  );
};

// Text bloat from graphql as array of strings
const textBloatToRemove = ['AdditionalSectionsSections', 'Layout'];

// Helper to strip text bloat from section layout string
function StripWordsFromLayoutName(stringToStrip) {
    const regex = new RegExp(textBloatToRemove.join('|'), 'g');
    return stringToStrip.replace(regex, '');
}
  
export default AdditionalSections;

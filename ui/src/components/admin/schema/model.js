export const schemaArr = [
  {
    displayName: 'Name',
    accessor: 'name',
  },
  {
    displayName: 'Type',
    accessor: 'type',
  },
  {
    displayName: 'Growth Rate',
    accessor: 'growth_rate',
  },
  {
    displayName: 'Split Ratio',
    accessor: 'split_ratio',
  },
  {
    displayName: 'Gender',
    accessor: 'gender',
  },
  {
    displayName: 'Race',
    accessor: 'race',
  },
  {
    displayName: 'Age At Diagnosis',
    accessor: 'age_at_diagnosis',
  },
  {
    displayName: 'Age At Sample Acquisition',
    accessor: 'age_at_sample_acquisition',
  },
  {
    displayName: 'Date of Availability',
    accessor: 'date_of_availability',
  },
  {
    displayName: 'Primary Site',
    accessor: 'primary_site',
  },
  {
    displayName: 'TNM Stage',
    accessor: 'tnm_stage',
  },
  {
    displayName: 'Neoadjuvant Therapy',
    accessor: 'neoadjuvant_therapy',
  },
  {
    displayName: 'Chemotherapeutic Drugs',
    accessor: 'chemotherapeutic_drugs',
  },
  {
    displayName: 'Disease Status',
    accessor: 'disease_status',
  },
  {
    displayName: 'Vital Status',
    accessor: 'vital_status',
  },
  {
    displayName: 'Therapy',
    accessor: 'therapy',
  },
  {
    displayName: 'Molecular Characterization',
    accessor: 'molecular_characterizations',
  },
  {
    displayName: 'Clinical Tumor Diagnosis',
    accessor: 'clinical_tumor_diagnosis',
  },
  {
    displayName: 'Histological Type',
    accessor: 'histological_type',
  },
  {
    displayName: 'Clinical Stage Grouping',
    accessor: 'clinical_stage_grouping',
  },
  {
    displayName: 'Site Of Sample Acquisition',
    accessor: 'site_of_sample_acquisition',
  },
  {
    displayName: 'Tumor Histological Grade',
    accessor: 'tumor_histological_grade',
  },
  {
    displayName: 'Licensing Requirements',
    accessor: 'licensing_required',
  },
  {
    displayName: 'Model URL',
    accessor: 'source_model_url',
  },
  {
    displayName: 'Sequence URL',
    accessor: 'source_sequence_url',
  },
  {
    displayName: 'UpdatedBy',
    accessor: 'updatedBy',
  },
  {
    displayName: 'CreatedAt',
    accessor: 'createdAt',
  },
  {
    displayName: 'UpdatedAt',
    accessor: 'updatedAt',
  }
];

export const schemaObj = schemaArr.reduce((acc, curr) => {
  acc[curr.accessor] = curr;
  return acc;
}, {});

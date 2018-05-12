import exportMapping from './exportMapping';
import properties from '../model/properties.mapping';
import settings from '../model/settings.index';

let validMapping = {
  mappings: {
    model_test: {
      properties: {
        age_at_diagnosis: {
          type: 'long',
        },
        age_at_aquisition: {
          type: 'long',
        },
        date_of_availability: {
          type: 'date',
          format: 'yyyy-MM-dd HH:mm:ss.SSSSSS||yyyy-MM-dd HH:mm:ss',
        },
        date_created: {
          type: 'date',
          format: 'yyyy-MM-dd HH:mm:ss.SSSSSS||yyyy-MM-dd HH:mm:ss',
        },
        date_updated: {
          type: 'date',
          format: 'yyyy-MM-dd HH:mm:ss.SSSSSS||yyyy-MM-dd HH:mm:ss',
        },
        chemotherapeutic_drug_list_available: {
          type: 'boolean',
        },
        clinical_diagnosis: {
          properties: {
            aquisition_site: {
              type: 'keyword',
            },
            clinical_tumor_diagnosis: {
              type: 'keyword',
            },
            clinical_stage_grouping: {
              type: 'keyword',
            },
            histologcal_grade: {
              type: 'keyword',
            },
            histological_type: {
              type: 'keyword',
            },
            histopathological_biomarkers: {
              type: 'keyword',
            },
          },
        },
        disease_status: {
          type: 'keyword',
        },
        files: {
          type: 'nested',
          properties: {
            file_type: {
              type: 'keyword',
            },
            file_name: {
              type: 'keyword',
            },
          },
        },
        gender: {
          type: 'keyword',
        },
        growth_rate: {
          type: 'long',
        },
        licensing_required: {
          type: 'boolean',
        },
        molecular_characterizations: {
          type: 'keyword',
        },
        name: {
          type: 'keyword',
        },
        neoadjuvant_therapy: {
          type: 'keyword',
        },
        tnm_state_t: {
          type: 'keyword',
        },
        tnm_stage_n: {
          type: 'keyword',
        },
        tnm_stage_m: {
          type: 'keyword',
        },
        primary_site: {
          type: 'keyword',
        },
        race: {
          type: 'keyword',
        },
        source: {
          type: 'keyword',
        },
        source_model_url: {
          type: 'keyword',
        },
        source_sequence_url: {
          type: 'keyword',
        },
        split_ratio: {
          type: 'keyword',
        },
        variants: {
          type: 'nested',
          properties: {
            category: {
              type: 'keyword',
            },
            external_db_ids: {
              properties: {
                civic: {
                  type: 'keyword',
                },
                cosmic: {
                  type: 'keyword',
                },
              },
            },
            genes: {
              properties: {
                gene_symbol: {
                  type: 'keyword',
                },
              },
            },
            name: {
              type: 'keyword',
            },
            type: {
              type: 'keyword',
            },
          },
        },
        therapy: {
          type: 'keyword',
        },
        type: {
          type: 'keyword',
        },
        vital_status: {
          type: 'keyword',
        },
      },
    },
  },
  settings: {
    analysis: {
      analyzer: {
        autocomplete_analyzed: {
          filter: ['lowercase', 'edge_ngram'],
          tokenizer: 'standard',
        },
        autocomplete_prefix: {
          filter: ['lowercase', 'edge_ngram'],
          tokenizer: 'keyword',
        },
        lowercase_keyword: {
          filter: ['lowercase'],
          tokenizer: 'keyword',
        },
      },
      filter: {
        edge_ngram: {
          max_gram: '20',
          min_gram: '1',
          side: 'front',
          type: 'edge_ngram',
        },
      },
    },
    'index.mapping.nested_fields.limit': 100,
    'index.max_result_window': 100000000,
  },
};

test('Mapping transformed correctly (faker keys removed)', () => {
  let mapping = exportMapping({
    name: 'model_test',
    properties,
    settings,
  });

  expect(mapping).toEqual(validMapping);
});
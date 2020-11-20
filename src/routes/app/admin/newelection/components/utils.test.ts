
import { getDerivedValues,getRequiredSettings } from './utils';

describe('Election creation utils', () => {
  describe('Generate required election setting', () => {
    it('should generate the correct required settings for a template election', () => {
      const expectedSettings = ['template', 'templateName', 'ouTag'];
      expect(getRequiredSettings({template: true})).toEqual(expectedSettings);
    })

    it('should be able to add a manual field to a template election', () => {
      const expectedSettings = ['template', 'templateName', 'ouTag', 'name'];
      expect(
        getRequiredSettings(
          {
            template: true,
            templateManualFields: ['name']
          }
        )).toEqual(expectedSettings);
    })

    it('should be able to add multiple manual fields to a template election', () => {
      const expectedSettings = ['template', 'templateName', 'ouTag', 'name', 'groupType'];
      expect(
        getRequiredSettings(
          {
            template: true,
            templateManualFields: ['name', 'groupType']
          }
        )).toEqual(expectedSettings);
    })

    it('should be able to can generate the correct required settings for a template election', () => {
      const expectedSettings = ['group', 'name', 'ouTag'];
      expect(getRequiredSettings({template: false})).toEqual(expectedSettings);
    })
  })

  describe('Get correct derived values', () => {

    const ouLists = {
      department: [],
      faculty: [],
      root: [
        {
          externalId: 900000,
          id: "afd52b8e-7066-492b-95a9-41b9665fbc54",
          name: {
            en: 'University of Oslo',
            nb: 'Universitetet i Oslo',
            nn: 'Universitetet i Oslo'
          },
          tag: "root"
        }
      ],
      unit: [
        {
        externalId: "110000",
        id: "260c698c-8a13-4518-839a-ca27151a009f",
        name: {
          nb: "Det teologiske fakultet",
          en: "Faculty of Theology", 
          nn: "Det teologiske fakultet" },
        tag: "unit"
        }
      ]
    }

    it('should get null values on empty input', () => {
      expect(getDerivedValues([], [], ouLists)).toEqual({ou: null, name: null});
    })

    it('correct root ou for a root election', () => {
      const settings = {
        ouTag: 'root',
        template: true,
        templateName: 'uio_principal'
      }
      const values = {
        option1: {
          label: "Styreleder",
          value: 0
        },
        option2: {
          label: "Rektorat",
          value: 0
        }
      }
      expect(getDerivedValues(values, settings, ouLists)).toEqual({ou: ouLists.root[0], name: null})
    })

    it('correct ou for a unit election', () => {
      const settings = {
        ouTag: 'unit',
        template: true,
        templateName: 'uio_dean'
      }
      const values = {
        option1: {
          label: "Styreleder",
          value: 0
        },
        option2: {
          label: "Dekan/dekanat",
          value: 1
        },
        option3ou: {
          label: "Det teologiske fakultet (110000)",
          value: 0
        }
      }
      expect(getDerivedValues(values, settings, ouLists)).toEqual({ou: ouLists.unit[0], name: null})
    })

    it('correct ou and name for a manual name template election', () => {
      const settings = {
        ouTag: 'root',
        template: true,
        templateName: 'uio_vb',
        templateManualFields: ['name']
      }
      const name = {
        en: 'Faculty of faculties',
        nb: 'Fakultets fakultetet',
        nn: 'Fakultets fakultetet'
      }
      const values = {
        option1: {
          label: "Verneombud",
          value: 3
        },
        option2name: {
          value: name
        }
      }
      expect(getDerivedValues(values, settings, ouLists)).toEqual({ou: ouLists.root[0], name: name})
    })
  })
})
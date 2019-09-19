import React from 'react';
import { useTranslation, withTranslation } from 'react-i18next';
import { DropDown } from 'components/form/DropDown';
import { MobileMenu, MobileMenuItem } from './MobileMenu';
import ActionText from 'components/actiontext'

const options = [
  {
    name: 'English',
    value: 'en',
  },
  {
    name: 'Norsk nynorsk',
    value: 'nn',
  },
  {
    name: 'Norsk bokmål',
    value: 'nb',
  },
];

const Toggler: React.FunctionComponent = () => {
  const { i18n, t } = useTranslation();

  return (
    <DropDown
      placeholder={t('general.language')}
      onDesktopMenu
      options={options}
      value={i18n.language}
      onChange={newValue => {
        i18n.changeLanguage(newValue);

      }}
    />
  );
};

export const MobileLanguageToggler: React.FunctionComponent = () => {
  const { i18n, t } = useTranslation();

  return (
    <MobileMenu placeholder={t('general.language')}>
      {options.map(option => (
        <MobileMenuItem>
          <ActionText inline action={() => {
            i18n.changeLanguage(option.value)}}>
            {option.name}
          </ActionText>
        </MobileMenuItem>
      ))}
    </MobileMenu>
  )
}

export default withTranslation()(Toggler);

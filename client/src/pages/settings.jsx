import { useState } from "react";
import Panel from "../components/containers/panel";
import PanelForm from "../components/containers/panel-form";
import { useTheme } from "../contexts/theme-context";
import SwitchField from "../components/controls/fields/check/switch-field";
import SelectField from "../components/controls/fields/select/select-field";
import { useTranslation } from "react-i18next";

export default function Settings() {
  const theme = useTheme();
  const modelState = useState({ dark: theme.isDark() });
  const [model, setModel] = modelState;
  const { i18n } = useTranslation('pages', { keyPrefix: 'settings' });
  const languages = Object.keys(i18n.services.resourceStore.data).map((language) => { return {value: language, label: language }; });
  const t = i18n.getFixedT(null, 'pages', 'settings');

  function handleLanguageChange() {
    i18n.changeLanguage(model.language, (error, t) => {
      if (error) return console.error('Something went wrong trying to change the language.', error);
    });
  }

  return (
    <PanelForm title={t('title')} size="medium" model={modelState} id="settings" >
      <Panel subTitle="General" model={{}}  >
        <div className="row">
          <div className="col-md-6">
            <SelectField attr="language" options={languages} onChange={() => { handleLanguageChange() }} ></SelectField>
          </div>
        </div>
      </Panel>
      <Panel subTitle="Tema" model={{}}  >
        <div className="row">
          <div className="col-md-6">
            <SwitchField attr="dark" label="Modo Claro/Oscuro" onChange={() => theme.toggle()} ></SwitchField>
          </div>
        </div>
      </Panel>
   </PanelForm>
  );
}
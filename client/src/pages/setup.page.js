import React, { useState } from "react";

import ConfigsSection from "../sections/setup.configs.section";
import SettingsSection from "../sections/setup.settings.section";
import CredsSection from "../sections/setup.creds.section";
import FinishedSection from "../sections/setup.finished.section";
import Steps from "../components/steps.component";

export default () => {
  const [steps, setSteps] = useState(stepsList);

  const [currentStep, setCurrentStep] = useState(steps.configs);

  function done(step, data) {
    setSteps((currentSteps) => ({
      ...currentSteps,
      [step]: { ...currentSteps[step], isCompleted: true, data: { ...data } },
    }));
    setCurrentStep(steps[steps[step].next]);
  }

  function handleReturn(from) {
    const stepName = steps[from].prev;
    const stepToReturnTo = steps[stepName];
    setCurrentStep(stepToReturnTo);
    setSteps((currentSteps) => ({
      ...currentSteps,
      [stepName]: { ...stepToReturnTo, isCompleted: false },
    }));
  }

  return (
    <div className="row mb-3 mt-3">
      <h1 className="col-12 col-lg-7 offset-lg-2">SETUP</h1>
      <Steps list={steps} current={currentStep} />
      {currentStep.render(done, currentStep.data, handleReturn)}
    </div>
  );
};

const stepsList = {
  configs: {
    title: "Configs",
    next: "settings",
    isCompleted: false,
    data: {},
    render: function (done, data) {
      return <ConfigsSection stepCompleted={done} data={data} />;
    },
  },
  settings: {
    title: "Settings",
    next: "creds",
    prev: "configs",
    isCompleted: false,
    data: {},
    render: function (done, data, handleReturn) {
      return (
        <SettingsSection
          stepCompleted={done}
          onReturn={handleReturn}
          data={data}
        />
      );
    },
  },
  creds: {
    title: "Admin User",
    next: "finished",
    prev: "settings",
    isCompleted: false,
    data: {},
    render: function (done, data, handleReturn) {
      return (
        <CredsSection
          stepCompleted={done}
          onReturn={handleReturn}
          data={data}
        />
      );
    },
  },
  finished: {
    title: "Finished",
    prev: "creds",
    isCompleted: false,
    render: () => <FinishedSection />,
  },
};

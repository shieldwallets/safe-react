import React, { createContext, ReactElement, useContext, useMemo, useState } from 'react'
import { history } from 'src/store'

const stepperContext = createContext({})

function useStepper(): any {
  const context = useContext(stepperContext)

  const hasContextDefined = Object.keys(context).length > 0

  if (!hasContextDefined) {
    throw new Error('useStepper must be used within a StepperProvider!')
  }

  return context
}

type StepperProviderTypes = {
  onFinish?: () => void
  store?: any
  disableNextButton?: boolean
  nextButtonType?: string
  nextButtonLabel?: string
  stepsComponents: ReactElement[]
  children: ReactElement
}

function StepperProvider({
  onFinish,
  store,
  disableNextButton,
  nextButtonType,
  nextButtonLabel,
  stepsComponents,
  children,
}: StepperProviderTypes): ReactElement {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = useMemo(() => React.Children.toArray(stepsComponents), [stepsComponents])
  const CurrentStepComponent = steps[currentStep]

  const isSubmitButton = nextButtonType === 'submit'
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep > steps.length - 2
  const customNextButtonLabel = nextButtonLabel

  const onClickPreviousStep = () => {
    if (isFirstStep) {
      history.goBack()
    } else {
      setCurrentStep((step) => step - 1)
    }
  }

  const onClickNextStep = () => {
    if (isSubmitButton) {
      return
    }

    if (isLastStep) {
      onFinish?.()
      return
    }

    setCurrentStep((step) => step + 1)
  }

  const state = {
    currentStep,
    setCurrentStep,
    steps,

    CurrentStepComponent,

    isFirstStep,
    isLastStep,

    onClickPreviousStep,
    onClickNextStep,

    disableNextButton,
    nextButtonType,
    customNextButtonLabel,

    ...store,
  }

  return <stepperContext.Provider value={state}>{children}</stepperContext.Provider>
}

export { useStepper, StepperProvider }
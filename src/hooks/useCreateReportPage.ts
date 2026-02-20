import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateReport } from './useReports';
import { useAuth } from './useAuth';
import { CreateReportFormValues } from '../types/createReport.types';
import { CreateLostReportData } from '../types/report.types';
import { createReportFormSchema } from '../validators';

export const useCreateReportPage = () => {
  const navigate = useNavigate();
  const { createReport, isSubmitting } = useCreateReport();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<CreateReportFormValues>({
    resolver: yupResolver(createReportFormSchema) as unknown as Resolver<CreateReportFormValues>,
    defaultValues: {
      identifyingFeatures: [],
      contactEmail: user?.email || '',
      dateLost: new Date().toISOString().split('T')[0],
      itemSize: 'MEDIUM',
    }
  });

  const selectedCategory = watch('category');

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'identifyingFeatures',
  });

  const onSubmitHandler = useCallback(async (data: CreateReportFormValues) => {
    const submissionData: CreateLostReportData = {
      ...data,
      dateLost: new Date(data.dateLost).toISOString(),
      identifyingFeatures: data.identifyingFeatures.map(f => f.text),
      category: data.category,
      bagContents: data.bagContents 
        ? data.bagContents.split(',').map(item => item.trim()).filter(Boolean)
        : undefined,
    };

    await createReport(submissionData);
  }, [createReport]);

  const addIdentifyingFeature = useCallback((text: string) => {
    const trimmed = text.trim();
    if (trimmed) {
      append({ text: trimmed });
    }
  }, [append]);

  return {
    register,
    handleSubmit,
    control,
    errors,
    fields,
    removeFeature: remove,
    addIdentifyingFeature,
    onSubmitHandler,
    isSubmitting,
    selectedCategory,
    navigate
  };
};

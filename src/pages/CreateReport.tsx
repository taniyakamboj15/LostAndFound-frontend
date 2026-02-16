import { InfoIcon } from '@assets/svg';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input, Select, Textarea, Card } from '@components/ui';
import { lostReportSchema } from '../validators';
import {  ITEM_CATEGORIES } from '@constants/categories';
import { useCreateReport } from '@hooks/useReports';
import { useAuth } from '@hooks/useAuth';
import { ComponentErrorBoundary } from '@components/feedback';
import { useEffect } from 'react';
import { CreateReportFormData } from '../types/createReport.types';

const CreateReport = () => {
  const navigate = useNavigate();
  const { createReport, isSubmitting } = useCreateReport();

  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateReportFormData>({
    resolver: yupResolver(lostReportSchema),
    defaultValues: {
      identifyingFeatures: [],
      contactEmail: user?.email || '',
    }
  });

  // Debug errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log('Form validation errors:', errors);
    }
  }, [errors]);

  const onSubmit = async (data: CreateReportFormData) => {
    await createReport({
      ...data,
      dateLost: data.dateLost instanceof Date ? data.dateLost.toISOString() : data.dateLost,
    });
  };

  return (
    <ComponentErrorBoundary title="Submit Report Error">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Submit Lost Report</h1>
          <p className="text-gray-600 mt-1">
            Report your lost item and we'll notify you if we find a match
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Item Information */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Item Information
            </h2>
            <div className="space-y-4">
              <Select
                label="Category"
                options={[
                  { value: '', label: 'Select a category' },
                  ...Object.entries(ITEM_CATEGORIES).map(([key, cat]) => ({
                    value: key,
                    label: cat.label,
                  })),
                ]}
                error={errors.category?.message}
                fullWidth
                required
                {...register('category')}
              />

              <Textarea
                label="Description"
                placeholder="Describe your lost item in detail (brand, color, model, unique features, etc.)"
                helperText="Be as specific as possible to help us match it with found items"
                error={errors.description?.message}
                fullWidth
                required
                rows={4}
                {...register('description')}
              />
            </div>
          </Card>

          {/* Loss Details */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Where and When Did You Lose It?
            </h2>
            <div className="space-y-4">
              <Input
                label="Location Lost"
                placeholder="e.g., Main Library, Student Center"
                helperText="Where did you last see or use this item?"
                error={errors.locationLost?.message}
                fullWidth
                required
                {...register('locationLost')}
              />

              <Input
                label="Date Lost"
                type="date"
                helperText="Approximate date when you lost the item"
                error={errors.dateLost?.message}
                fullWidth
                required
                {...register('dateLost')}
              />
            </div>
          </Card>

          {/* Contact Information */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Contact Information (Optional)
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              We'll use your account email by default, but you can provide alternative contact details
            </p>
            <div className="space-y-4">
              <Input
                label="Alternative Email"
                type="email"
                placeholder="your@email.com"
                error={errors.contactEmail?.message}
                fullWidth
                {...register('contactEmail')}
              />

              <Input
                label="Phone Number"
                type="tel"
                placeholder="1234567890"
                helperText="10 digits"
                error={errors.contactPhone?.message}
                fullWidth
                {...register('contactPhone')}
              />
            </div>
          </Card>

          {/* Important Notice */}
          <Card className="bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <InfoIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">
                  What Happens Next?
                </p>
                <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                  <li>We'll automatically search for matching found items</li>
                  <li>You'll receive email notifications for high-confidence matches</li>
                  <li>You can view all potential matches on your report page</li>
                  <li>If you find your item, you can file a claim directly</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/reports')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              Submit Report
            </Button>
          </div>
        </form>
      </div>
    </ComponentErrorBoundary>
  );
};

export default CreateReport;

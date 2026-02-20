import { AlertCircle, FileText as FileTextIcon, MapPin } from 'lucide-react';
import BackButton from '@components/ui/BackButton';
import { Button, Card, Spinner, Select } from '@components/ui';
import { ComponentErrorBoundary } from '@components/feedback';

// Hooks
import { useFileClaimPage } from '@hooks/useFileClaimPage';

// Components
import ClaimItemSummary from '@components/claims/ClaimItemSummary';
import ClaimDescriptionForm from '@components/claims/ClaimDescriptionForm';
import ClaimProofUpload from '@components/claims/ClaimProofUpload';



const FileClaim = () => {
  const {
    itemId,
    item,
    isItemLoading,
    itemError,
    proofFiles,
    isSubmitting,
    removeFile,
    selectedCity,
    cityOptions,
    filteredLocations,
    register,
    handleSubmit,
    errors,
    onFileSelectorChange,
    onSubmitHandler,
    handleCityChange,
    navigate
  } = useFileClaimPage();

  if (!itemId) {
    return (
      <Card className="max-w-2xl mx-auto text-center py-12">
        <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <p className="text-gray-600">Invalid claim request. Please select an item first.</p>
        <Button
          variant="primary"
          onClick={() => navigate('/items')}
          className="mt-4"
        >
          Browse Items
        </Button>
      </Card>
    );
  }

  if (isItemLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (itemError || !item) {
    return (
      <Card className="max-w-2xl mx-auto text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600">{itemError || 'Item not found'}</p>
        <BackButton 
          label="Back to Items" 
          variant="outline" 
          className="mt-4"
        />      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">File a Claim</h1>
        <p className="text-gray-600 mt-1">
          Submit your claim for the found item
        </p>
      </div>

      <ComponentErrorBoundary title="Claim Form Error">
        <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
          
          <ClaimItemSummary item={item} />
          
          <ClaimDescriptionForm register={register} errors={errors} />

          {/* Pickup Location Selection */}
          <Card className="border-l-4 border-l-indigo-500">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-indigo-500" />
              Pickup Destination
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Select where you'd like to collect your item. We recommend picking a city closest to you.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Select
                label="Step 1: Choose City"
                options={cityOptions}
                fullWidth
                required
                value={selectedCity}
                onChange={(e) => handleCityChange(e.target.value)}
              />

              <Select
                label="Step 2: Choose Branch"
                options={[
                  { value: '', label: selectedCity ? 'Select a branch' : 'Choose city first' },
                  ...filteredLocations.map(loc => ({
                    value: loc._id,
                    label: loc.name
                  }))
                ]}
                disabled={!selectedCity}
                error={errors.preferredPickupLocation?.message}
                fullWidth
                required
                {...register('preferredPickupLocation')}
              />
            </div>

            {item.storageLocation && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between text-xs text-gray-500">
                <span>Current Location:</span>
                <span className="font-bold text-gray-700">
                  {typeof item.storageLocation === 'object' ? item.storageLocation.name : 'Central Branch'} ({typeof item.storageLocation === 'object' ? item.storageLocation.city : 'Main Office'})
                </span>
              </div>
            )}
          </Card>
          
          <ClaimProofUpload 
            proofFiles={proofFiles} 
            onFileChange={onFileSelectorChange} 
            onRemoveFile={removeFile} 
          />

          {/* Important Notice */}
          <Card className="bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-3">
              <FileTextIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Important Information
                </p>
                <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                  <li>Your claim will be reviewed by our staff</li>
                  <li>Internal transfers may take 2-3 business days</li>
                  <li>You can only book a pickup once the item arrives</li>
                  <li>You'll be notified via email about status changes</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              Submit Claim
            </Button>
          </div>
        </form>
      </ComponentErrorBoundary>
    </div>
  );
};

export default FileClaim;

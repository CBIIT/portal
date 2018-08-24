import React from 'react';
import Component from 'react-component-component';
import { fetchData } from '../services/Fetcher';

export const ModelSingleContext = React.createContext();

// Helper functions
const isFormReadyToSave = (dirty, errors) => dirty && !('name' in errors);

const isFormReadyToPublish = (values, dirty, errors) =>
  (values.status !== 'published' || dirty) && Object.keys(errors).length === 0;

const computeModelStatus = (currentStatus, action) => {
  /*
  *  Matrix
  * -------------------------------------------
  *             |    save     |    publish    |
  * -------------------------------------------
  * unpublished | unpublished |   published   |
  * unpub. chgs | unpub. chgs |   published   |
  * other       | unpublished |   published   |
  * published   | unpub. chgs |   published   |
  * -------------------------------------------
*/

  const status = {
    unpublished: 'unpublished',
    unpublishedChanges: 'unpublished changes',
    other: 'other',
    published: 'published',
  };

  const statusMatrix = {
    unpublished: {
      save: status.unpublished,
      publish: status.published,
    },
    unpublishedChanges: {
      save: status.unpublishedChanges,
      publish: status.published,
    },
    other: {
      save: status.unpublished,
      publish: status.published,
    },
    published: {
      save: status.unpublishedChanges,
      publish: status.published,
    },
  };

  const statusKey = Object.keys(status).find(key => status[key] === currentStatus);

  return currentStatus ? statusMatrix[statusKey][action] : status.unpublished;
};

// Add an id to notifications (ISO Datetime)
const generateNotification = notification => ({
  ...notification,
  id: new Date().valueOf(),
});

// async abstractions
const getModel = async (baseUrl, modelName) =>
  fetchData({
    url: `${baseUrl}/model/${modelName}`,
    data: '',
    method: 'get',
  });

const saveModel = async (values, isUpdate, baseUrl) => {
  const { name } = values;

  const url = isUpdate ? `${baseUrl}/model/${name}` : `${baseUrl}/model`;

  return fetchData({
    url,
    data: values,
    method: isUpdate ? 'patch' : 'post',
  });
};

// Provider
export const ModelSingleProvider = ({ baseUrl, modelName, children, ...props }) => (
  <Component
    initialState={{
      ui: {
        activeTab: 'edit',
      },
      data: {
        isLoading: false,
        response: {},
        error: null,
      },
      form: {
        isReadyToSave: false,
        isReadyToPublish: false,
        isUpdate: false,
        values: {},
        dirty: false,
        touched: {},
        errors: {},
      },
      imageFiles: [],
      savedImageFiles: [],
      notifications: [],
    }}
    didMount={async ({ state, setState }) => {
      if (modelName) {
        // Set loading true
        setState(() => ({
          ...state,
          data: {
            ...state.data,
            isLoading: true,
          },
        }));

        try {
          const modelDataResponse = await getModel(baseUrl, modelName);

          setState(() => ({
            ...state,
            data: {
              ...state.data,
              isLoading: false,
              response: modelDataResponse.data,
            },
          }));
        } catch (err) {
          setState(() => ({
            ...state,
            data: {
              ...state.data,
              isLoading: false,
              error: err,
            },
          }));
        }
      }
    }}
  >
    {({ state, setState }) => (
      <ModelSingleContext.Provider
        value={{
          state: state,
          setUIActiveTab: tabName => {
            setState({
              ...state,
              ui: {
                ...state.ModelSingle,
                activeTab: tabName,
              },
              form: {
                ...state.form,
                isReadyToSave: tabName === 'images' ? true : state.form.isReadyToSave,
              },
            });
          },
          syncFormState: async formState => {
            setState({
              ...state,
              form: {
                ...state.form,
                ...formState,
                isReadyToSave: isFormReadyToSave(formState.dirty, formState.errors),
                isReadyToPublish: isFormReadyToPublish(
                  formState.values,
                  formState.dirty,
                  formState.errors,
                ),
              },
            });
          },
          saveForm: async () => {
            // Set loading true (lock UI)
            const {
              form: { values },
              savedImageFiles,
            } = state;
            await setState(() => ({
              ...state,
              data: {
                ...state.data,
                isLoading: true,
              },
            }));

            try {
              const {
                form: { isUpdate },
              } = state;

              const modelDataResponse = await saveModel(
                {
                  ...values,
                  files: Object.entries(savedImageFiles).map(([id, info]) => ({
                    file_name: id,
                    file_type: info.type,
                  })),
                  status: computeModelStatus(values.status, 'save'),
                },
                isUpdate,
                baseUrl,
              );

              await setState(() => ({
                ...state,
                // Set form to unsavable status (will release on next form interaction)
                form: {
                  ...state.form,
                  isReadyToSave: false,
                },
                // Put save response into data
                data: {
                  ...state.data,
                  isLoading: false,
                  response: modelDataResponse.data,
                },
                notifications: [
                  ...state.notifications,
                  generateNotification({
                    type: 'success',
                    message: 'Save Successful!',
                    details: 'Model has been succesfully saved, however not yet published.',
                  }),
                ],
              }));
            } catch (err) {
              setState(() => ({
                ...state,
                data: {
                  ...state.data,
                  isLoading: false,
                  error: err,
                },
                notifications: [
                  ...state.notifications,
                  generateNotification({
                    type: 'error',
                    message: 'Save Error.',
                    details: err.msg || 'Unknown error has occured.',
                  }),
                ],
              }));
            }
          },
          publishForm: async values => {
            // Set loading true (lock UI)
            await setState(() => ({
              ...state,
              data: {
                ...state.data,
                isLoading: true,
              },
            }));

            try {
              // First save the model
              const {
                form: { isUpdate },
              } = state;

              await saveModel(
                {
                  ...values,
                  status: computeModelStatus(values.status, 'publish'),
                },
                isUpdate,
                baseUrl,
              );

              // Then after successful save we publish
              const url = `${baseUrl}/publish/model/${values._id}`;

              await fetchData({
                url,
                data: '',
                method: 'post',
              });

              // If successful get fresh model data (with new status and any
              // other transformations may take place when publishing)
              const modelDataResponse = await getModel(baseUrl, values.name);

              setState({
                ...state,
                form: {
                  ...state.form,
                  isReadyToPublish: false,
                  isReadyToSave: false,
                },
                data: {
                  ...state.data,
                  isLoading: false,
                  response: modelDataResponse.data,
                },
                notifications: [
                  ...state.notifications,
                  generateNotification({
                    type: 'success',
                    message: 'Publish Successful!',
                    details: 'Model has been succesfully published. View it live here: ',
                    link: `/model/${modelDataResponse.data.name}`,
                    linkText: modelDataResponse.data.name,
                  }),
                ],
              });
            } catch (err) {
              setState(() => ({
                ...state,
                data: {
                  ...state.data,
                  isLoading: false,
                  error: err,
                },
                notifications: [
                  ...state.notifications,
                  generateNotification({
                    type: 'error',
                    message: 'Publish Error.',
                    details: err.msg || 'Unknown error has occured.',
                  }),
                ],
              }));
            }
          },
          clearNotification: id => {
            const notifications = state.notifications.filter(
              notification => notification.id !== id,
            );
            setState({
              ...state,
              notifications,
            });
          },
          clearAllNotifications: () =>
            setState({
              ...state,
              notifications: [],
            }),
          setImageFiles: imageFiles => setState({ ...state, imageFiles }),
          uploadImages: async () => {
            state.imageFiles.forEach(async file => {
              let formData = new FormData();
              formData.append('filename', file.name);
              formData.append('image', file);
              const response = await fetchData({
                url: `${baseUrl}/images`,
                data: formData,
                method: 'post',
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
              console.log(response);
              if (response.status >= 200 && response.status < 300) {
                setState({
                  ...state,
                  savedImageFiles: {
                    ...state.savedImageFiles,
                    [response.data.id]: { filename: response.data.filename, type: file.type },
                  },
                });
              }
            });
          },
        }}
        {...props}
      >
        {children}
      </ModelSingleContext.Provider>
    )}
  </Component>
);

export default ModelSingleProvider;

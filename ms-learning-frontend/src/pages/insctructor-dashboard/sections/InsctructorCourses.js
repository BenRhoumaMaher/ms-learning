import React from 'react';
import CourseActions from '../../../components/instructor-dashboard/CourseActions';
import EditCourseModal from '../../../components/instructor-dashboard/EditCourseModal';
import DeleteCourseModal from '../../../components/instructor-dashboard/DeleteCourseModal';
import AddContentModal from '../../../components/instructor-dashboard/AddContentModal';
import AddResourceModal from '../../../components/instructor-dashboard/AddResourceModal';
import AddLessonModal from '../../../components/instructor-dashboard/AddLessonModal';
import useInstructorCourses from '../../../hooks/useInstructorCourses';
import { useTranslation } from 'react-i18next';

const InstructorCourses = () => {
  const {
    courses,
    loading,
    successMessage,
    deleteModalOpen,
    showContentModal,
    showAddResourceModal,
    showAddLessonModal,
    formData,
    lessonData,
    selectedCourseId,
    courseDetails,
    courseToDelete,
    selectedCourseForResource,
    selectedModuleForResource,
    selectedLessonForResource,
    resourceFile,
    coursesWithLessonsNoResources,
    selectedCourseForLesson,
    selectedModuleForLesson,

    handleCourseChange,
    handleInputChange,
    handleUpdateCourse,
    handleDeleteCourse,
    handleAddResource,
    handleAddLesson,
    setSelectedCourseId,
    setCourseToDelete,
    setDeleteModalOpen,
    setShowContentModal,
    setShowAddResourceModal,
    setShowAddLessonModal,
    setSelectedCourseForResource,
    setSelectedModuleForResource,
    setSelectedLessonForResource,
    setResourceFile,
    setSelectedCourseForLesson,
    setSelectedModuleForLesson,
    setLessonData,
    setFormData,
    validateLessonData
  } = useInstructorCourses();
  const { t } = useTranslation();

  return (
    <div className='container insctrucours-container'>
      <h2 className='insctrucours-title'>{t('Manage Courses')}</h2>
      <p className='insctrucours-subtitle'>{t('Easily manage your existing ones')}</p>

      {successMessage && (
        <div className='alert alert-success' role='alert'>
          {successMessage}
        </div>
      )}

      <CourseActions
        setDeleteModalOpen={setDeleteModalOpen}
        setShowContentModal={setShowContentModal}
      />

      <EditCourseModal
        courses={courses}
        selectedCourseId={selectedCourseId}
        courseDetails={courseDetails}
        formData={formData}
        loading={loading}
        handleCourseChange={handleCourseChange}
        handleInputChange={handleInputChange}
        handleUpdateCourse={handleUpdateCourse}
      />

      <DeleteCourseModal
        deleteModalOpen={deleteModalOpen}
        courseToDelete={courseToDelete}
        courses={courses}
        loading={loading}
        setDeleteModalOpen={setDeleteModalOpen}
        setCourseToDelete={setCourseToDelete}
        handleDeleteCourse={handleDeleteCourse}
      />

      <AddContentModal
        showContentModal={showContentModal}
        setShowContentModal={setShowContentModal}
        setShowAddLessonModal={setShowAddLessonModal}
        setShowAddResourceModal={setShowAddResourceModal}
      />

      <AddResourceModal
        showAddResourceModal={showAddResourceModal}
        selectedCourseForResource={selectedCourseForResource}
        selectedModuleForResource={selectedModuleForResource}
        selectedLessonForResource={selectedLessonForResource}
        resourceFile={resourceFile}
        coursesWithLessonsNoResources={coursesWithLessonsNoResources}
        loading={loading}
        setShowAddResourceModal={setShowAddResourceModal}
        setSelectedCourseForResource={setSelectedCourseForResource}
        setSelectedModuleForResource={setSelectedModuleForResource}
        setSelectedLessonForResource={setSelectedLessonForResource}
        setResourceFile={setResourceFile}
        handleAddResource={handleAddResource}
      />

      <AddLessonModal
        showAddLessonModal={showAddLessonModal}
        selectedCourseForLesson={selectedCourseForLesson}
        selectedModuleForLesson={selectedModuleForLesson}
        lessonData={lessonData}
        courses={courses}
        setShowAddLessonModal={setShowAddLessonModal}
        setSelectedCourseForLesson={setSelectedCourseForLesson}
        setSelectedModuleForLesson={setSelectedModuleForLesson}
        setLessonData={setLessonData}
        handleAddLesson={handleAddLesson}
        validateLessonData={validateLessonData}
      />
    </div>
  );
};

export default InstructorCourses;
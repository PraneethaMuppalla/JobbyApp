import './index.css'

const FiltersGroup = props => {
  const renderEmploymentsList = () => {
    const {employmentTypesList} = props

    return employmentTypesList.map(employment => {
      const {changeEmploymentType} = props
      const onClickEmployment = () => {
        changeEmploymentType(employment.employmentTypeId)
      }

      return (
        <li className="category-item" key={employment.employmentTypeId}>
          <input
            type="checkbox"
            id={employment.employmentTypeId}
            onClick={onClickEmployment}
          />
          <label htmlFor={employment.employmentTypeId} className="white">
            {employment.label}
          </label>
        </li>
      )
    })
  }

  const renderSalaryList = () => {
    const {salaryRangesList} = props

    return salaryRangesList.map(salary => {
      const {changeSalaryRange} = props
      const onClickSalary = () => {
        changeSalaryRange(salary.salaryRangeId)
      }

      return (
        <li className="category-item" key={salary.salaryRangeId}>
          <input
            type="radio"
            name="salary"
            id={salary.salaryRangeId}
            onClick={onClickSalary}
          />
          <label htmlFor={salary.salaryRangeId} className="white">
            {salary.label}
          </label>
        </li>
      )
    })
  }

  const renderEmploymentType = () => (
    <>
      <h1 className="category-heading">Type of Employment</h1>
      <ul className="categories-list">{renderEmploymentsList()}</ul>
    </>
  )

  const renderSalaryType = () => (
    <>
      <h1 className="category-heading">Salary Range</h1>
      <ul className="categories-list">{renderSalaryList()}</ul>
    </>
  )

  return (
    <div className="filters-group-container">
      {renderEmploymentType()}
      {renderSalaryType()}
    </div>
  )
}

export default FiltersGroup

import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'

import FiltersGroup from '../FiltersGroup'
import JobCard from '../JobCard'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobsSection extends Component {
  state = {
    jobsList: [],
    apiStatus: apiStatusConstants.initial,
    employmentTypeId: '',
    searchInput: '',
    salaryRangeId: '',
    profileDetails: {},
    profileStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobs()
    this.getProfile()
  }

  getProfile = async () => {
    this.setState({
      profileStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const profileUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(profileUrl, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      const updatedProfile = {
        profileDetails: {
          name: data.profile_details.name,
          shortBio: data.profile_details.short_bio,
          profileImageUrl: data.profile_details.profile_image_url,
        },
      }
      console.log(updatedProfile)
      this.setState({
        profileDetails: updatedProfile.profileDetails,
        profileStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        profileStatus: apiStatusConstants.failure,
      })
    }
  }

  getJobs = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {salaryRangeId, searchInput, employmentTypeId} = this.state

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeId}&minimum_package=${salaryRangeId}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
      }))
      this.setState({
        jobsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  enterSearchInput = () => {
    this.getJobs()
  }

  changeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  changeSalaryRange = id => {
    this.setState({salaryRangeId: id}, this.getJobs)
  }

  changeEmploymentType = id => {
    const {employmentTypeId} = this.state
    if (employmentTypeId !== '') {
      const updatedId = `${employmentTypeId},${id}`
      this.setState({employmentTypeId: updatedId}, this.getJobs)
    } else {
      const updatedId = id
      this.setState({employmentTypeId: updatedId}, this.getJobs)
    }
  }

  renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="products-failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" onClick={this.getJobs}>
        Retry
      </button>
    </div>
  )

  renderProfileSuccess = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <div className="filter-container">
        <img src={profileImageUrl} alt="profile" />
        <h1>{name}</h1>
        <p>{shortBio}</p>
      </div>
    )
  }

  renderProfileFailure = () => (
    <button type="button" onClick={this.getProfile}>
      Retry
    </button>
  )

  renderJobsListView = () => {
    const {jobsList} = this.state
    const shouldShowJobsList = jobsList.length > 0
    return shouldShowJobsList ? (
      <div className="all-products-container">
        <ul>
          {jobsList.map(eachJob => (
            <JobCard job={eachJob} key={eachJob.id} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-products-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          className="no-products-img"
          alt="no jobs"
        />
        <h1 className="no-products-heading">No Jobs Found</h1>
        <p className="no-products-description">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderAllProfile() {
    const {profileStatus} = this.state

    switch (profileStatus) {
      case apiStatusConstants.success:
        return this.renderProfileSuccess()
      case apiStatusConstants.failure:
        return this.renderProfileFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderAllJobs() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {searchInput, employmentTypeId, salaryRangeId} = this.state
    const {employmentTypesList, salaryRangesList} = this.props

    return (
      <div className="all-products-section">
        <div>
          {this.renderAllProfile()}
          <FiltersGroup
            searchInput={searchInput}
            salaryRangeId={salaryRangeId}
            employmentTypeId={employmentTypeId}
            changeEmploymentType={this.changeEmploymentType}
            changeSalaryRange={this.changeSalaryRange}
            employmentTypesList={employmentTypesList}
            salaryRangesList={salaryRangesList}
          />
        </div>
        <div className="main-container">
          <div className="search-input-container">
            <input
              value={searchInput}
              type="search"
              className="search-input"
              placeholder="Search"
              onChange={this.changeSearchInput}
            />
            <button
              type="button"
              data-testid="searchButton"
              onClick={this.enterSearchInput}
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          {this.renderAllJobs()}
        </div>
      </div>
    )
  }
}

export default JobsSection

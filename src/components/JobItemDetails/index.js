import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {TiLocation} from 'react-icons/ti'
import {FaShoppingBag} from 'react-icons/fa'
import Header from '../Header'
import SimilarJobItem from '../SimilarJobItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobData: {},
    similarJobsData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobData()
  }

  getJobData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const jobDetails = {
        companyLogoUrl: fetchedData.job_details.company_logo_url,
        companyWebsiteUrl: fetchedData.job_details.company_website_url,
        employmentType: fetchedData.job_details.employment_type,
        jobDescription: fetchedData.job_details.job_description,
        id: fetchedData.job_details.id,
        title: fetchedData.job_details.title,
        skills: fetchedData.job_details.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
        lifeAtCompany: {
          description: fetchedData.job_details.life_at_company.description,
          imageUrl: fetchedData.job_details.life_at_company.image_url,
        },
        location: fetchedData.job_details.location,
        packagePerAnnum: fetchedData.job_details.package_per_annum,
        rating: fetchedData.job_details.rating,
      }
      const similarJobDetails = fetchedData.similar_jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        jobData: jobDetails,
        similarJobsData: similarJobDetails,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

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
      <button type="button" onClick={this.getJobData}>
        Retry
      </button>
    </div>
  )

  renderJobDetailsView = () => {
    const {jobData, similarJobsData} = this.state
    const {
      companyLogoUrl,
      employmentType,
      jobDescription,
      title,
      location,
      packagePerAnnum,
      companyWebsiteUrl,
      skills,
      lifeAtCompany,
      rating,
    } = jobData

    return (
      <div className>
        <div className="product-item">
          <div className="logo-container">
            <img
              src={companyLogoUrl}
              className="logo"
              alt="job details company logo"
            />
            <div>
              <h1 className="title">{title}</h1>
              <div className="rating-container">
                <AiFillStar className="star" />

                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="middle-container">
            <div className="location-container">
              <TiLocation className="location-icon" />
              <p className="location">{location}</p>
              <FaShoppingBag className="location-icon" />
              <p className="location">{employmentType}</p>
            </div>
            <p className="title">{packagePerAnnum}</p>
          </div>
          <hr className="line" />
          <h1 className="title">Description</h1>
          <a href={companyWebsiteUrl}>Visit</a>
          <p className="description">{jobDescription}</p>
          <div>
            <h1 className="Skills">Skills</h1>

            <ul className="skill-list">
              {skills.map(eachSkill => (
                <li className="each-skill" key={eachSkill.name}>
                  <img
                    src={eachSkill.imageUrl}
                    alt={eachSkill.name}
                    className="list-image"
                  />
                  <p className="location">{eachSkill.name}</p>
                </li>
              ))}
            </ul>
          </div>
          <h1 className="title">Life at company</h1>
          <div className="life-container">
            <p className="life-description description">
              {lifeAtCompany.description}
            </p>
            <img
              src={lifeAtCompany.imageUrl}
              alt="life at company"
              className="life-image"
            />
          </div>
        </div>
        <h1>Similar Jobs</h1>
        <ul className="similar-products-list">
          {similarJobsData.map(eachSimilarJob => (
            <SimilarJobItem each={eachSimilarJob} key={eachSimilarJob.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderJobDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-item-details-container">
          {this.renderJobDetails()}
        </div>
      </>
    )
  }
}

export default JobItemDetails

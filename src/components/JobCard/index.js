import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {TiLocation} from 'react-icons/ti'
import {FaShoppingBag} from 'react-icons/fa'

import './index.css'

const JobCard = props => {
  const {job} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = job

  return (
    <li className="product-item">
      <Link to={`/jobs/${id}`} className="link-item">
        <div className="logo-container">
          <img
            src={companyLogoUrl}
            className="logo"
            alt="company logo
"
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
          <h1 className="title">{packagePerAnnum}</h1>
        </div>
        <hr className="line" />
        <h1 className="tittle">Description</h1>
        <p className="description">{jobDescription}</p>
      </Link>
    </li>
  )
}
export default JobCard

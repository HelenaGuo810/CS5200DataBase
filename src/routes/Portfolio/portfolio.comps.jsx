// import Footer from '../../comps/footer/footer.comp';
import PortfolioCards from '../../comps/portfolio-card/portfolio-card.comp';

export default function Portfolio() {

  const desktopData = [
    {
        key: '1',
        "name": "Seraph Station",
        "date": "September 2019",
        "image": "/assets/portfolio/desktop/image-seraph.jpg"
    },
    {
        key: '2',
        "name": "Eebox Building",
        "date": "August 2017",
        "image": "/assets/portfolio/desktop/image-eebox.jpg"
    },
    {
        key: '3',
        "name": "Federal II Tower",
        "date": "March 2017",
        "image": "/assets/portfolio/desktop/image-federal.jpg"
    },
    {
        key: '4',
        "name": "Project Del Sol",
        "date": "January 2016",
        "image": "/assets/portfolio/desktop/image-del-sol.jpg"
    },
    {
        key: '5',
        "name": "Le Prototype",
        "date": "October 2015",
        "image": "/assets/portfolio/desktop/image-prototype.jpg"
    },
    {
        key: '6',
        "name": "228B Tower",
        "date": "April 2015",
        "image": "/assets/portfolio/desktop/image-228b.jpg"
    },
    {
        key: '7',
        "name": "Grand Edelweiss Hotel",
        "date": "December 2013",
        "image": "/assets/portfolio/desktop/image-edelweiss.jpg"
    },
    {
        key: '8',
        "name": "Netcry Tower",
        "date": "August 2012",
        "image": "/assets/portfolio/desktop/image-netcry.jpg"
    },
    {
        key: '9',
        "name": "Hypers",
        "date": "January 2012",
        "image": "/assets/portfolio/desktop/image-hypers.jpg"
    },
    {
        key: '10',
        "name": "SXIV Tower",
        "date": "March 2011",
        "image": "/assets/portfolio/desktop/image-sxiv.jpg"
    },
    {
        key: '11',
        "name": "Trinity Bank Tower",
        "date": "September 2010",
        "image": "/assets/portfolio/desktop/image-trinity.jpg"
    },
    {
        key: '12',
        "name": "Project Paramour",
        "date": "February 2008",
        "image": "/assets/portfolio/desktop/image-paramour.jpg"
    }
]

  const tabletData = [
    {
        key: '1',
        "name": "Seraph Station",
        "date": "September 2019",
        "image": "/assets/portfolio/tablet/image-seraph.jpg"
    },
    {
        key: '2',
        "name": "Eebox Building",
        "date": "August 2017",
        "image": "/assets/portfolio/tablet/image-eebox.jpg"
    },
    {
        key: '3',
        "name": "Federal II Tower",
        "date": "March 2017",
        "image": "/assets/portfolio/tablet/image-federal.jpg"
    },
    {
        key: '4',
        "name": "Project Del Sol",
        "date": "January 2016",
        "image": "/assets/portfolio/tablet/image-del-sol.jpg"
    },
    {
        key: '5',
        "name": "Le Prototype",
        "date": "October 2015",
        "image": "/assets/portfolio/tablet/image-prototype.jpg"
    },
    {
        key: '6',
        "name": "228B Tower",
        "date": "April 2015",
        "image": "/assets/portfolio/tablet/image-228b.jpg"
    },
    {
        key: '7',
        "name": "Grand Edelweiss Hotel",
        "date": "December 2013",
        "image": "/assets/portfolio/tablet/image-edelweiss.jpg"
    },
    {
        key: '8',
        "name": "Netcry Tower",
        "date": "August 2012",
        "image": "/assets/portfolio/tablet/image-netcry.jpg"
    },
    {
        key: '9',
        "name": "Hypers",
        "date": "January 2012",
        "image": "/assets/portfolio/tablet/image-hypers.jpg"
    },
    {
        key: '10',
        "name": "SXIV Tower",
        "date": "March 2011",
        "image": "/assets/portfolio/tablet/image-sxiv.jpg"
    },
    {
        key: '11',
        "name": "Trinity Bank Tower",
        "date": "September 2010",
        "image": "/assets/portfolio/tablet/image-trinity.jpg"
    },
    {
        key: '12',
        "name": "Project Paramour",
        "date": "February 2008",
        "image": "/assets/portfolio/tablet/image-paramour.jpg"
    }
]

  return(
    <div>
      <div className='vert-container'>
        <span className='vert-line'></span>
        <p className='vert-text'>PORTFOLIO</p>
      </div>
{/* MAIN PAGE CONTENT */}
      <div className='page-container'>
        <PortfolioCards 
          data={desktopData}
          data2={tabletData}
        />
      </div>

      {/* <Footer /> */}
    </div>
  )
}
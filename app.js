// inititalize materialize javascript events
document.addEventListener('DOMContentLoaded', function() {
    const date = document.querySelectorAll('.datepicker');
    M.Datepicker.init(date);
    const collapse = document.querySelectorAll('.collapsible');
    M.Collapsible.init(collapse);

    // Get Local Storage items
    getJobs();
    appliedToday();
});

// Define DOM variables

const form = document.querySelector('#job-form');
const jobList = document.querySelector('.collapsible');
const clearBtn = document.querySelector('.clear-jobs');
const filter = document.querySelector('#filter');
const companyInput = document.querySelector('#company');
const linkInput = document.querySelector('#link');
const dateInput = document.querySelector('#date');
const descriptionInput = document.querySelector('#description');

// Load all event listeners

loadEventListeners();

function loadEventListeners() {
  form.addEventListener('submit', recieveForm);
  // remove job event
  jobList.addEventListener('click', removeJob);
  // clear jobs event
  clearBtn.addEventListener('click', clearJobs);
  // filter jobs event
  filter.addEventListener('keyup', filterJobs);
}

// Add job from form

function recieveForm(e) {
  e.preventDefault();
  // Define value variables
  const company = e.target.company;
  const link = e.target.link;
  const date = e.target.date;
  const description = e.target.description;

  // Store values in array
  const valueArr = [company, date, description, link];
  // Filter values that aren't filled out
  const filteredValues = valueArr.filter(element => element.value != "");
  createElements(filteredValues);
  M.toast({html: 'Nice! Good luck!'})
}

function createElements(arr) {
  // create li
  const job = document.createElement('li');

  // create collapsible header at arr[0] since it's required and first
  const jobHeader = document.createElement('div');
  jobHeader.innerHTML = `<div id='job-name'><i class="material-icons">business_center</i>${arr[0].value}</div><a href="#" class="delete-icon"><i class="material-icons">clear</i>`;
  jobHeader.className = 'job-header';
  jobHeader.className = 'collapsible-header';
  // append li header to li
  job.appendChild(jobHeader);

  // Create the collapsible job body
  const jobBody = document.createElement('div');
  jobBody.className = 'collapsible-body';

  // Create collection inside body
  const bodyCollection = document.createElement('ul');
  bodyCollection.className = 'collection';



  // loop through remaining elements since the company name aka arr[0] is assigned
  for(let i = 1; i < arr.length; i++) {
    // create collection items aka arr info
    const collectionItem = document.createElement('li');
    collectionItem.className = 'collection-item';

    // if link add anchor
    if(arr[i].name === 'link'){
      collectionItem.innerHTML = `<a href=${arr[i].value} class='teal-text lighten-2'>View Job</a>`
    } else {
      collectionItem.innerHTML = arr[i].value;
    }

    // append collection item to the bodyCollection
    bodyCollection.appendChild(collectionItem);
  }

  // bodyCollection add to jobBody
  jobBody.appendChild(bodyCollection);

  // jobBody added to job
  job.appendChild(jobBody);

  // finally append the new job to the job list
  jobList.appendChild(job);

  // store in local storage
  storeJobInLocalStorage(arr);
  appliedToday();
}

// Store job
function storeJobInLocalStorage(arr) {
  if(localStorage.getItem('jobs') === null) {
    jobs = [];
  } else {
    jobs = JSON.parse(localStorage.getItem('jobs'));
  }

  const jobArr = arr.map(index => [index.name, index.value]);

  jobs.push(jobArr);

  localStorage.setItem('jobs', JSON.stringify(jobs))
  form.reset();
}

// Get jobs from Ls
function getJobs() {
  if(localStorage.getItem('jobs') === null) {
    jobs = [];
  } else {
    jobs = JSON.parse(localStorage.getItem('jobs'));
  }

  jobs.forEach(function(index){
      // create li
  const job = document.createElement('li');

  // create collapsible header at arr[0] since it's required and first
  const jobHeader = document.createElement('div');
  jobHeader.innerHTML = `<div id='job-name'><i class="material-icons">business_center</i>${index[0][1]}</div><a href="#" class="delete-icon"><i class="material-icons">clear</i>`;
  jobHeader.className = 'job-header';
  jobHeader.className = 'collapsible-header';
  // append li header to li
  job.appendChild(jobHeader);

  // Create the collapsible job body
  const jobBody = document.createElement('div');
  jobBody.className = 'collapsible-body';

  // Create collection inside body
  const bodyCollection = document.createElement('ul');
  bodyCollection.className = 'collection';



  // loop through remaining elements since the company name aka arr[0] is assigned
  for(let i = 1; i < index.length; i++) {
    // create collection items aka arr info
    const collectionItem = document.createElement('li');
    collectionItem.className = 'collection-item';

    // if link add anchor
    if(index[i][0] === 'link'){
      collectionItem.innerHTML = `<a href=${index[i][1]} class='teal-text lighten-2'>View Job</a>`
    } else {
      collectionItem.innerHTML = index[i][1];
    }

    // append collection item to the bodyCollection
    bodyCollection.appendChild(collectionItem);
  }

  // bodyCollection add to jobBody
  jobBody.appendChild(bodyCollection);

  // jobBody added to job
  job.appendChild(jobBody);

  // finally append the new job to the job list
  jobList.appendChild(job);
  })
}

// remove job
function removeJob(e) {
  if(e.target.parentElement.classList.contains('delete-icon')){
    e.target.parentElement.parentElement.parentElement.remove()
    // remove from LS
    removeFromLocalStorage(e.target.parentElement.parentElement.parentElement)
  }
}

// remove from LS
function removeFromLocalStorage(jobItem) {
  if(localStorage.getItem('jobs') === null) {
    jobs = [];
  } else {
    jobs = JSON.parse(localStorage.getItem('jobs'));
  }

  jobs.forEach(function(job, index){
    const lsJobName = job[0][1];
    const jobName = jobItem.firstChild.firstChild.textContent.split('business_center')[1];
    if(jobName === lsJobName){
      jobs.splice(index, 1);
    }
  })
  localStorage.setItem('jobs', JSON.stringify(jobs));
  appliedToday()
}

// clear jobs
function clearJobs(e) {
  while(jobList.firstChild){
    jobList.removeChild(jobList.firstChild);
  }
  clearFromLocalStorage();
  appliedToday();
}

// clear from LS
function clearFromLocalStorage() {
  localStorage.clear()
}

// filter jobs
function filterJobs(e) {
  const text = e.target.value.toLowerCase();
  const jobs = document.querySelectorAll('.collapsible-header');
  jobs.forEach(function(job) {
    const item = job.firstChild.textContent.split('business_center')[1]
    if(item.toLowerCase().indexOf(text) != -1) {
      job.style.display = 'flex';
    } else {
      job.style.display = 'none';
    }
  });
}

function appliedToday() {
  if(localStorage.getItem('jobs') === null) {
    jobs = [];
  } else {
    jobs = JSON.parse(localStorage.getItem('jobs'));
  }

  console.log(jobs.length);
}









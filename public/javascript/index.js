function input_box()
{
    const form  = document.querySelectorAll(".register_form");
    form.set.overflow = scroll;
   
}

const date = new Date();

const a = date.getDate();

const year = date.getFullYear();
const month = date.getMonth()

const dateEl = document.getElementById("Date_info");



dateEl.textContent = a + "/" + month + "/" + year ;



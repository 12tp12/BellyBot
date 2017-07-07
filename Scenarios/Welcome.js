
// Constructor
function wellcom() {
    // always initialize all instance properties
    // this.bar = bar;
    this.questions =[
        {waitForAnswer:false, text:'Hi %s, I\'m Bellybot. I\'m here to help you lose weight and to live better.', fillParam:'name'},
        {waitForAnswer:true, text:'Let me ask you a few questions so we get to know eachother.', buttons:[{text:'Yep! Let\'s go', payload:'yes'}]},
        {waitForAnswer:true, text:'Let\' start with a simple one, are you a male or a female?', buttons:[{text:'I\'m a male', payload:'male'},{text:'I\'m a Female', payload:'female'},{text:'Something in between', payload:'other'}], paramToSave:'gender'},
        {waitForAnswer:true, text:'What is your current weight in KG? Com\'on... no cheating.', paramToSave:'starting-weight'},
        {waitForAnswer:true, text:'Great, and what is your height in CM?', paramToSave:'starting-height'},
        {waitForAnswer:false, text:'Ok, so far so good... just a few more questions.'},
        {waitForAnswer:true, text:'How old are you?', paramToSave:'age'},
        {waitForAnswer:false, text:'Last one... I promise!'},
        {waitForAnswer:true, text:'If you had to define your number one goal, what would it be?', buttons:[{text:'Lose some weight', payload:'loseWeight'},{text:'Reduce fat percentage', payload:'reduceFatPercentage'},{text:'I want to stay healthy', payload:'stayHealthy'}], paramToSave:'mainGoal'},
        {waitForAnswer:false, text:'That\'s all for now %s', fillParam:'name'},
        // {waitForAnswer:false, text:'We are going to do .'},
        // {'text':''}
    ]; // default value
}
// class methods
// wellcom.prototype.method1 = function() {
//
// };
// export the class
module.exports = wellcom;
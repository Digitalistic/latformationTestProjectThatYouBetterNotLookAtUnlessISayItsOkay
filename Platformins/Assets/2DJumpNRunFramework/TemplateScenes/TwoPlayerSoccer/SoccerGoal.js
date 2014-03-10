#pragma strict

var score : int = 0;
var text_object : TextMesh;

var ball_reset_point : Vector3;

function Start()
{
	ball_reset_point = GameObject.Find("ball").transform.position; // save the start position of the ball
}

function OnTriggerEnter (other : Collider) {
    if(other.name=="ball")
    {
    	score++;
    	text_object.text="Score: " + score;
    	GameObject.Find("ball").transform.position = ball_reset_point; // set the ball position to the start position!
    	GameObject.Find("ball").rigidbody.velocity=Vector3.zero; // stop the ball!
    }
}
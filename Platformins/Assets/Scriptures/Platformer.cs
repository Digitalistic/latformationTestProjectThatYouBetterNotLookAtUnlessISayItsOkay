using UnityEngine;
using System.Collections;

public class Platformer : MonoBehaviour 
{
	public float walkSpeed;
	public float runSpeed;
	public float jumpSpeed;
	public float gravScale;

	Vector2 myVelo;

	float xIn, yIn;

	bool isRunning = false;

	// Use this for initialization
	void Start () 
	{
		rigidbody2D.gravityScale = gravScale;	//Gravity, starring Sandra Bullock, coming soon to DVD and Blu-Ray!
	}
	
	// Update is called once per frame
	void Update () 
	{
		ProcessMovement();
	}

	void ProcessMovement()
	{
		myVelo = rigidbody2D.velocity;	//get the current velocity. we're going to mess with this!
		
		xIn = Input.GetAxis("Horizontal");
		yIn = Input.GetAxis("Vertical");
		
		if(isRunning)	//if we're running, use run speed, and check for button release
		{
			myVelo.x = xIn * runSpeed;

			if(Input.GetButtonUp("Run"))
				isRunning = false;
		}
		else   //if we're walking, use walk speed and check for run button press
		{
			myVelo.x = xIn * walkSpeed;
			
			if(Input.GetButtonDown("Run"))
				isRunning = true;
		}
		
		if(Input.GetButtonDown("Jump"))	//jumpin
		{
			myVelo.y = jumpSpeed;
		}


		if(Mathf.Abs(myVelo.y) > jumpSpeed)	//limit y-axis speed for constant falling
		{

		}

		rigidbody2D.velocity = myVelo;	//apply our given velocity
	}
}

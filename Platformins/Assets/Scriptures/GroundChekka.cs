using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class GroundChekka : MonoBehaviour 
{
	Platformer owner;
	public List<Collider2D> floors;

	void Start()
	{
		owner = transform.parent.GetComponent<Platformer>();
	}

	void OnTriggerEnter2D(Collider2D other)
	{
		//Debug.Log("Foot collision with " + other.name);

		if(floors.Count <= 0)
			owner.LandOnFloor();

		floors.Add(other);

		Debug.Log("Landed: " + floors.Count.ToString());
	}

	void OnTriggerExit2D(Collider2D other)
	{
		//Debug.Log("Exited feet: " + other.name);
		floors.Remove(other);

		if(floors.Count <= 0)
			owner.LeaveFloor();

		Debug.Log("Departed: " + floors.Count.ToString());
	}
	
	public void ClearCollisionList()
	{
		floors.Clear();
	}
}
